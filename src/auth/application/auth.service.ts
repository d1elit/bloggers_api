import { LoginInput } from '../router/input/login.input';
import {
  LoginError,
  RegistrationConfirmationError,
} from '../../core/errors/domain.errors';
import { UsersRepository } from '../../users/infrastructure/repositories/users.repository';
import { JwtService } from '../adapters/jwt.service';
import { RegistrationInput } from '../router/input/registration.input';
import { NodemailerService } from '../adapters/nodemailer.service';
import { authInput } from '../router/input/auth.input';
import { jwtDecode } from 'jwt-decode';
import { SessionsRepository } from '../../sessions/repositories/sessionsRepository';
import { refreshTokenPayload } from '../types/refreshTokenPayload';
import { emailExamples } from '../adapters/emailExamples';
import { UsersQueryRepository } from '../../users/infrastructure/repositories/users.query-repository';
import { NewPasswordInput } from '../router/input/new-password.input';
import { UsersService } from '../../users/application/users.service';
import { BcryptService } from '../adapters/bcrypt.service';
import { injectable } from 'inversify';
import { UserDocument } from '../../users/domain/userEntity';
import { SessionEntity } from '../../sessions/domain/sessionEntity';

@injectable()
export class AuthService {
  constructor(
    public readonly usersRepository: UsersRepository,
    public readonly usersQueryRepository: UsersQueryRepository,
    public readonly usersService: UsersService,
    public readonly sessionsRepository: SessionsRepository,
    public readonly bcryptService: BcryptService,
    public readonly jwtService: JwtService,
    public readonly nodemailerService: NodemailerService,
  ) {}

  async auth({ loginDto, ip, deviceName }: authInput): Promise<string[]> {
    const resultUser = await this.checkUserCredentials(loginDto);
    if (!resultUser) {
      throw new LoginError('Wrong login or password');
    }

    const deviceId = crypto.randomUUID();

    const accessToken = await this.jwtService.createAccessToken(
      resultUser._id.toString(),
    );
    const refreshToken = await this.jwtService.createRefreshToken(
      resultUser._id.toString(),
      deviceId,
    );
    const { exp, iat } = jwtDecode(refreshToken);

    const session = SessionEntity.createNew({
      deviceId,
      deviceName,
      userId: resultUser._id.toString(),
      ip,
      iat: iat!,
      exp: exp!,
    });

    await this.sessionsRepository.create(session);

    return [accessToken, refreshToken];
  }

  async checkUserCredentials(loginDto: LoginInput): Promise<UserDocument> {
    const user = await this.verifyLoginOrEmail(loginDto.loginOrEmail);
    const isPasswordVerified = await this.bcryptService.verifyPasswords(
      loginDto.password,
      user.password,
    );

    if (!user || !isPasswordVerified) {
      throw new LoginError('Wrong login or password ');
    }
    return user;
  }

  async verifyLoginOrEmail(login: string): Promise<UserDocument> {
    const user = await this.usersRepository.findByLoginOrEmail(login);
    if (!user) throw new LoginError('Wrong login or password');
    return user;
  }

  async register(userDto: RegistrationInput) {
    const confirmationCode = crypto.randomUUID();
    await this.usersService.create(userDto, confirmationCode);
    this.nodemailerService
      .sendEmail(
        userDto.email,
        emailExamples.registrationEmail(confirmationCode),
      )
      .catch((error) => {
        console.log('Email sending failed', error);
      });
  }

  async registrationConfirmation(code: string) {
    const user = await this.usersRepository.findByCodeOrError(code);
    const validation = user.canConfirmEmail(code);
    if (!validation.isValid) {
      throw new RegistrationConfirmationError(validation.error!, 'code');
    }
    user.confirmEmail();
    await this.usersRepository.save(user);
  }

  async emailResending(email: string) {
    const user = await this.usersRepository.findByLoginOrEmail(email);
    if (!user)
      throw new RegistrationConfirmationError('Email not exist', 'email');
    if (user.isEmailConfirmed())
      throw new RegistrationConfirmationError(
        'Email already confirmed',
        'email',
      );
    const confirmationCode = crypto.randomUUID();

    user.updateEmailConfirmationCode(confirmationCode);
    await this.usersRepository.save(user);

    await this.nodemailerService.sendEmail(
      email,
      emailExamples.registrationEmail(confirmationCode),
    );
  }

  async passwordRecovery(email: string) {
    const user = await this.usersQueryRepository.findByEmail(email);
    if (!user) return;

    const recoveryCode = crypto.randomUUID();
    user.updatePasswordRecoveryCode(recoveryCode);
    await this.usersRepository.save(user);

    this.nodemailerService
      .sendEmail(email, emailExamples.passwordRecoveryEmail(recoveryCode))
      .catch((error) => {
        console.log('Email sending failed', error);
      });
    return recoveryCode;
  }

  async passwordRecoveryConfirmation({ code, password }: NewPasswordInput) {
    const user = await this.usersRepository.findByRecoveryCodeOrError(code);
    const validation = user.canRecoverPassword(code);
    if (!validation.isValid) {
      throw new RegistrationConfirmationError(validation.error!, 'code');
    }
    let newPassword = await this.bcryptService.hashPassword(password);
    user.updatePassword(newPassword);
    await this.usersRepository.save(user);
  }

  async refreshToken(token: string, userId: string, deviceId: string) {
    const oldVersion = jwtDecode(token).iat;

    const accessToken = await this.jwtService.createAccessToken(userId);
    const refreshToken = await this.jwtService.createRefreshToken(
      userId,
      deviceId,
    );

    const { exp, iat } = jwtDecode(refreshToken);
    await this.sessionsRepository.update(iat!, exp!, oldVersion!);
    return [accessToken, refreshToken];
  }

  async ensureRefreshTokenValid(payload: refreshTokenPayload, token: string) {
    const session = await this.sessionsRepository.find(
      payload.iat,
      payload.deviceId,
    );

    if (!session) throw new LoginError('Unauthorized (refresh)');
  }

  // async
  async revokeToken(token: string) {
    const { iat } = jwtDecode(token);
    await this.sessionsRepository.delete(iat!);
  }

  async logout(token: string) {
    await this.revokeToken(token);
  }
}
