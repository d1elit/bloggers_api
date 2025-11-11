import { LoginInput } from '../router/input/login.input';
import {
  LoginError,
  RegistrationConfirmationError,
} from '../../core/errors/domain.errors';
import { User } from '../../users/types/user';
import { usersRepository } from '../../users/repositories/users.repository';
import { jwtService } from '../adapters/jwt.service';
import { WithId } from 'mongodb';
import { RegistrationInput } from '../router/input/registration.input';
import { usersService } from '../../users/application/users.service';
import { nodemailerService } from '../adapters/nodemailer.service';
import { bcryptService } from '../adapters/bcrypt.service';
import { authInput } from '../router/input/auth.input';
import { jwtDecode } from 'jwt-decode';
import { sessionsRepository } from '../../sessions/repositories/sessionsRepository';
import { refreshTokenPayload } from '../types/refreshTokenPayload';

export const authService = {
  async auth({ loginDto, ip, deviceName }: authInput): Promise<string[]> {
    const resultUser = await this.checkUserCredentials(loginDto);
    if (!resultUser) {
      throw new LoginError('Wrong login or password');
    }

    const deviceId = crypto.randomUUID();

    const accessToken = await jwtService.createAccessToken(
      resultUser._id.toString(),
    );
    const refreshToken = await jwtService.createRefreshToken(
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
    await sessionsRepository.create(session);
    console.log(session);

    return [accessToken, refreshToken];
  },

  async checkUserCredentials(loginDto: LoginInput): Promise<WithId<User>> {
    const user = await this.verifyLoginOrEmail(loginDto.loginOrEmail);
    const isPasswordVerified = await bcryptService.verifyPasswords(
      loginDto.password,
      user.password,
    );

    if (!user || !isPasswordVerified) {
      throw new LoginError('Wrong login or password ');
    }
    return user;
  },

  async verifyLoginOrEmail(login: string): Promise<WithId<User>> {
    const user = await usersRepository.findByLoginOrEmail(login);
    if (!user) throw new LoginError('Wrong login or password');
    return user;
  },

  async register(userDto: RegistrationInput) {
    const confirmationCode = crypto.randomUUID();
    await usersService.create(userDto, confirmationCode);
    nodemailerService
      .sendEmail(userDto.email, confirmationCode)
      .catch((error) => {
        console.log('Email sending failed', error);
      });
  },

  async registrationConfirmation(code: string) {
    const user = await usersRepository.findByCodeOrError(code);
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
    await usersRepository.updateConfirmationStatus(user._id);
    return false;
  },

  async emailResending(email: string) {
    const user = await usersRepository.findByLoginOrEmail(email);
    if (!user)
      throw new RegistrationConfirmationError('Email not exist', 'email');
    if (user.confirmationEmail.isConfirmed)
      throw new RegistrationConfirmationError(
        'Email already confirmed',
        'email',
      );
    const confirmationCode = crypto.randomUUID();
    await usersRepository.updateConfirmationCode(user._id, confirmationCode);
    await nodemailerService.sendEmail(email, confirmationCode);
  },

  async refreshToken(token: string, userId: string, deviceId: string) {
    const oldVersion = jwtDecode(token).iat;
    console.log('refreshToken OLD:', token);
    const accessToken = await jwtService.createAccessToken(userId);
    const refreshToken = await jwtService.createRefreshToken(userId, deviceId);
    console.log('REFRESH TOKEN NEW: ', refreshToken);
    const { exp, iat } = jwtDecode(refreshToken);
    await sessionsRepository.update(iat!, exp!, oldVersion!);
    return [accessToken, refreshToken];
  },

  async ensureRefreshTokenValid(payload: refreshTokenPayload, token: string) {
    const session = await sessionsRepository.find(
      payload.iat,
      payload.deviceId,
    );
    console.log('ensureRefreshTokenValid CHECK : ', 'token: ', token);
    if (!session) throw new LoginError('Unauthorized (refresh)');
    console.log('SESSION IS VALID with token:', token);
  },

  // async
  async revokeToken(token: string) {
    // await revokedTokensRepository.insert(token) ;
    const { iat } = jwtDecode(token);
    console.log('REVOKE TOKEN WITH IAT:', iat, token);
    await sessionsRepository.delete(iat!);
  },

  async logout(token: string) {
    console.log('LOGOUT:', token);
    await this.revokeToken(token);
  },
};
