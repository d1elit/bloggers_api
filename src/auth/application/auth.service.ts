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
import { revokedTokensRepository } from '../repositories/revokedTokens.repository';
import { bcryptService } from '../adapters/bcrypt.service';

export const authService = {
  async auth(loginDto: LoginInput): Promise<string[]> {
    const resultUser = await this.checkUserCredentials(loginDto);
    if (!resultUser) {
      throw new LoginError('LoginInput Failed');
    }
    const accessToken = await jwtService.createAccessToken(
      resultUser._id.toString(),
    );
    console.log(`Token: ${accessToken}`);
    const refreshToken = await jwtService.createRefreshToken(
      resultUser._id.toString(),
    );

    return [accessToken, refreshToken];
  },

  async checkUserCredentials(loginDto: LoginInput): Promise<WithId<User>> {
    const user = await this.verifyLoginOrEmail(loginDto.loginOrEmail);
    const isPasswordVerified = await bcryptService.verifyPasswords(
      loginDto.password,
      user.password,
    );

    if (!user || !isPasswordVerified) {
      throw new LoginError('Wrong login or password');
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
      throw new RegistrationConfirmationError('Already used code', 'code');
    if (code !== user.confirmationEmail.confirmationCode)
      throw new RegistrationConfirmationError('Wrong code', 'code');
    await usersRepository.updateConfirmationStatus(user._id);
    return false;
  },

  async emailResending(email: string) {
    const user = await usersRepository.findByLoginOrEmail(email);
    if (!user)
      throw new RegistrationConfirmationError('Email not exist', 'email');
    if (user.confirmationEmail.isConfirmed)
      throw new RegistrationConfirmationError('Already confirmed', 'email');
    const confirmationCode = crypto.randomUUID();
    await usersRepository.updateConfirmationCode(user._id, confirmationCode);
    await nodemailerService.sendEmail(email, confirmationCode);
  },

  async refreshToken(token: string, userId: string) {
    await this.revokeToken(token);

    const accessToken = await jwtService.createAccessToken(userId);
    const refreshToken = await jwtService.createRefreshToken(userId);

    return [accessToken, refreshToken];
  },
  async isTokenRevoked(refreshToken: string) {
    const token = await revokedTokensRepository.find(refreshToken);
    console.log(token);
    if (token) throw new LoginError('Token in blacklist');
    return false;
  },
  async revokeToken(token: string) {
    await revokedTokensRepository.insert(token);
  },

  async logout(token: string) {
    await this.revokeToken(token);
  },
};
