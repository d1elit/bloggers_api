import { Login } from '../types/login';
import { LoginError } from '../../core/errors/repostory-not-found.error';
import { User } from '../../users/types/user';
import { usersRepository } from '../../users/repositories/users.repository';
import { jwtService } from '../adapters/jwt.service';
import { WithId } from 'mongodb';

export const authService = {
  async auth(loginDto: Login): Promise<string> {
    let resultUser = await this.checkUserCredentials(loginDto);
    if (!resultUser) {
      throw new LoginError('Login Failed');
    }
    let token = await jwtService.createToken(resultUser._id.toString());
    console.log(`Token: ${token}`);
    return token;
  },

  async checkUserCredentials(loginDto: Login): Promise<WithId<User>> {
    let user = await this.verifyLoginOrEmail(loginDto.loginOrEmail);
    let isPasswordVerified = await this.verifyPasswords(
      loginDto.password,
      user.password,
    );

    if (!user || !isPasswordVerified) {
      throw new LoginError('Wrong login or password');
    }
    return user;
  },

  async verifyLoginOrEmail(login: string): Promise<WithId<User>> {
    let user = await usersRepository.findByLoginOrEmail(login);
    if (!user) throw new LoginError('Wrong login or password');
    return user;
  },

  async verifyPasswords(dtoPassword: string, userPassword: string) {
    const bcrypt = require('bcrypt');
    return await bcrypt.compare(dtoPassword, userPassword);
  },
};
