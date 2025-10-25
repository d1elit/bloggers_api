import { Login } from '../types/login';
import {LoginError, RegistrationConfirmationError} from '../../core/errors/repostory-not-found.error';
import { User } from '../../users/types/user';
import { usersRepository } from '../../users/repositories/users.repository';
import { jwtService } from '../adapters/jwt.service';
import { WithId } from 'mongodb';
import {Registration} from "../types/Registration";
import {v4 as uuidv4} from "uuid";
import {usersService} from "../../users/application/users.service";
import {nodemailerService} from "../adapters/nodemailer.service";

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

  async register(userDto: Registration) {
    let confirmationCode = uuidv4()
    await usersService.create(userDto,confirmationCode);
    nodemailerService.sendEmail(confirmationCode).catch((error) => {
      console.log('Email sending failed', error);
    })
  },

  async registrationConfirmation(code: string)  {
    let user = await usersRepository.findByCode(code);
    if (user.confirmationEmail.isConfirmed) throw new RegistrationConfirmationError("Wrong code")
    if (code !== user.confirmationEmail.confirmationCode) throw new RegistrationConfirmationError("Wrong code")
    await usersRepository.updateConfirmation(user._id);
    return false

  },

  async emailResending(email: string)  {
    let confirmationCode = uuidv4()
    await nodemailerService.sendEmail(confirmationCode)
  }
};
