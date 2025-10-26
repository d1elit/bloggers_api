import { UserInput } from '../router/input/user.input';
import { usersRepository } from '../repositories/users.repository';
import {
  UserCreationError
} from '../../core/errors/domain.errors';

import { v4 as uuidv4 } from 'uuid'
import {User} from "../types/user";
import {WithId} from "mongodb";
import {add} from 'date-fns'


export const usersService = {
  async create(userDto: UserInput, confirmationCode?:string): Promise<WithId<User>> {
    console.log('usersService confirmation code', confirmationCode);
    await usersService.ensureIsUserUnique(userDto.login, userDto.email);
    const newUser: User = {
      login: userDto.login,
      password: await usersService.hashPassword(userDto.password),
      email: userDto.email,
      createdAt: new Date().toISOString(),
      confirmationEmail: {
        confirmationCode: confirmationCode || uuidv4() ,
        isConfirmed: false,
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 3
        }).toISOString()
      }
    };
    return await usersRepository.create(newUser);
  },

  async delete(id: string) {
    return usersRepository.delete(id);
  },

  async ensureIsUserUnique(login: string, email: string) {
    let resLogin = await usersRepository.findFieldWithValue('login', login);
    let resEmail = await usersRepository.findFieldWithValue('email', email);
    if (resEmail) {
      throw new UserCreationError('Login or email already exist', 'email');
    }
    if (resLogin) {
      throw new UserCreationError('Login or email already exist', 'login');
    }
  },

  async hashPassword(password: string) {
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
  },
};
