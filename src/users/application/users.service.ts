import { UserInput } from '../router/dto/input/user.input';
import { UserCreationError } from '../../core/errors/domain.errors';
import { User } from '../domain/types/user';
import { add } from 'date-fns';
import { UsersRepository } from '../infrastructure/repositories/users.repository';
import { BcryptService } from '../../auth/adapters/bcrypt.service';
import { injectable } from 'inversify';
import { UserDocument, UserEntity, UserModel } from '../domain/userEntity';

@injectable()
export class UsersService {
  constructor(
    public readonly usersRepository: UsersRepository,
    public readonly bcryptService: BcryptService,
  ) {}

  async create(
    userDto: UserInput,
    confirmationCode?: string,
  ): Promise<UserDocument> {
    await this.ensureIsUserUnique(userDto.login, userDto.email);

    const hashedPassword = await this.bcryptService.hashPassword(
      userDto.password,
    );

    const user = new UserModel(
      UserEntity.createNew(userDto, hashedPassword, confirmationCode),
    );
    return await this.usersRepository.save(user);
  }

  async delete(id: string) {
    await this.usersRepository.findByIdOrError(id);
    return this.usersRepository.delete(id);
  }

  async ensureIsUserUnique(login: string, email: string) {
    let resLogin = await this.usersRepository.findFieldWithValue(
      'login',
      login,
    );
    let resEmail = await this.usersRepository.findFieldWithValue(
      'email',
      email,
    );
    if (resEmail) {
      throw new UserCreationError('LoginInput or email already exist', 'email');
    }
    if (resLogin) {
      throw new UserCreationError('LoginInput or email already exist', 'login');
    }
  }
}
