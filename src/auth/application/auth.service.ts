import { LoginInput } from '../router/input/login.input';
import {
  LoginError,
  RegistrationConfirmationError,
} from '../../core/errors/domain.errors';
import { User } from '../../users/types/user';
import { UsersRepository } from '../../users/repositories/users.repository';
import { JwtService } from '../adapters/jwt.service';
import { WithId } from 'mongodb';
import { RegistrationInput } from '../router/input/registration.input';
import { NodemailerService } from '../adapters/nodemailer.service';
import { authInput } from '../router/input/auth.input';
import { jwtDecode } from 'jwt-decode';
import { SessionsRepository } from '../../sessions/repositories/sessionsRepository';
import { refreshTokenPayload } from '../types/refreshTokenPayload';
import { emailExamples } from '../adapters/emailExamples';
import { UsersQueryRepository } from '../../users/repositories/users.query-repository';
import { NewPasswordInput } from '../router/input/new-password.input';
import { UsersService } from '../../users/application/users.service';
import { BcryptService } from '../adapters/bcrypt.service';

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

    const session = {
      deviceName: deviceName,
      deviceId: deviceId,
      userId: resultUser._id.toString(),
      ip: ip,
      iat: iat!,
      exp: exp!,
    };
    await this.sessionsRepository.create(session);
    console.log(session);

    return [accessToken, refreshToken];
  }

  async checkUserCredentials(loginDto: LoginInput): Promise<WithId<User>> {
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

  async verifyLoginOrEmail(login: string): Promise<WithId<User>> {
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
    if (user.confirmationEmail.isConfirmed)
      throw new RegistrationConfirmationError(
        'Confirm code already used',
        'code',
      );
    if (code !== user.confirmationEmail.confirmationCode)
      throw new RegistrationConfirmationError(
        'Wrong confirmation code',
        'code',
      );
    await this.usersRepository.updateConfirmationStatus(user._id);
    return false;
  }

  async emailResending(email: string) {
    const user = await this.usersRepository.findByLoginOrEmail(email);
    if (!user)
      throw new RegistrationConfirmationError('Email not exist', 'email');
    if (user.confirmationEmail.isConfirmed)
      throw new RegistrationConfirmationError(
        'Email already confirmed',
        'email',
      );
    const confirmationCode = crypto.randomUUID();
    await this.usersRepository.updateConfirmationCode(
      user._id,
      confirmationCode,
    );
    await this.nodemailerService.sendEmail(
      email,
      emailExamples.registrationEmail(confirmationCode),
    );
  }

  async passwordRecovery(email: string) {
    const user = await this.usersQueryRepository.findByEmail(email);
    if (!user) return;

    const confirmationCode = crypto.randomUUID();
    await this.usersRepository.updateRecoveryCode(user._id, confirmationCode);
    this.nodemailerService
      .sendEmail(email, emailExamples.passwordRecoveryEmail(confirmationCode))
      .catch((error) => {
        console.log('Email sending failed', error);
      });
    return confirmationCode;
  }

  async passwordRecoveryConfirmation({ code, password }: NewPasswordInput) {
    const user = await this.usersRepository.findByRecoveryCodeOrError(code);
    if (user.passwordRecovery.isUsed)
      throw new RegistrationConfirmationError(
        'Confirm code already used',
        'code',
      );
    if (code !== user.passwordRecovery.confirmationCode)
      throw new RegistrationConfirmationError(
        'Wrong confirmation code',
        'code',
      );
    await this.usersRepository.updateRecoveryStatus(user._id);
    let newPassword = await this.bcryptService.hashPassword(password);
    await this.usersRepository.updatePassword(user._id, newPassword);
  }

  async refreshToken(token: string, userId: string, deviceId: string) {
    const oldVersion = jwtDecode(token).iat;
    console.log('refreshToken OLD:', token);
    const accessToken = await this.jwtService.createAccessToken(userId);
    const refreshToken = await this.jwtService.createRefreshToken(
      userId,
      deviceId,
    );
    console.log('REFRESH TOKEN NEW: ', refreshToken);
    const { exp, iat } = jwtDecode(refreshToken);
    await this.sessionsRepository.update(iat!, exp!, oldVersion!);
    return [accessToken, refreshToken];
  }

  async ensureRefreshTokenValid(payload: refreshTokenPayload, token: string) {
    const session = await this.sessionsRepository.find(
      payload.iat,
      payload.deviceId,
    );
    console.log('ensureRefreshTokenValid CHECK : ', 'token: ', token);
    if (!session) throw new LoginError('Unauthorized (refresh)');
    console.log('SESSION IS VALID with token:', token);
  }

  // async
  async revokeToken(token: string) {
    // await revokedTokensRepository.insert(token) ;
    const { iat } = jwtDecode(token);
    console.log('REVOKE TOKEN WITH IAT:', iat, token);
    await this.sessionsRepository.delete(iat!);
  }

  async logout(token: string) {
    console.log('LOGOUT:', token);
    await this.revokeToken(token);
  }
}
