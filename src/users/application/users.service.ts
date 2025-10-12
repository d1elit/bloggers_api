import { UserInput } from '../router/input/user.input';
import { usersRepository } from '../repositories/users.repository';
import {usersQueryRepository} from "../repositories/users.query-repository";
import {RepositoryNotFoundError} from "../../core/errors/repostory-not-found.error";

export const usersService = {
  async create(userDto: UserInput) {
    await usersService.ensureIsUserUnique(userDto.login, userDto.email);
    const newUser = {
      login: userDto.login,
      password: userDto.password,
      email: userDto.email,
      createdAt: new Date().toISOString(),
    };
    return await usersRepository.create(newUser);
  },

  async delete(id: string) {
    return usersRepository.delete(id);
  },

  async ensureIsUserUnique(login:string, email:string) {
    let resLogin = await usersQueryRepository.findByField('login', login);
    let resEmail = await usersQueryRepository.findByField('email', email);
    if (resLogin || resEmail) {
      throw new RepositoryNotFoundError('Login or email already exist');
    }
  }
};
