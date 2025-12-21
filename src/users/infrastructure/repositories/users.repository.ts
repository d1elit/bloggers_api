import { RepositoryNotFoundError } from '../../../core/errors/domain.errors';
import { injectable } from 'inversify';
import { UserDocument, UserEntity, UserModel } from '../../domain/userEntity';

@injectable()
export class UsersRepository {
  async create(newUser: UserEntity): Promise<UserDocument> {
    return await UserModel.create(newUser);
  }
  async save(user: UserDocument) {
    return await user.save();
  }

  async delete(id: string) {
    await UserModel.deleteOne({ _id: id });
    return;
  }

  async findFieldWithValue(
    fieldName: string,
    fieldValue: string,
  ): Promise<UserDocument | null> {
    return UserModel.findOne({ [fieldName]: fieldValue });
  }

  async findByLoginOrEmail(loginOrEmail: string): Promise<UserDocument | null> {
    return UserModel.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });
  }

  async findByIdOrError(userId: string): Promise<UserDocument> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new RepositoryNotFoundError('User not found', 'user');
    }
    return user;
  }

  async findByCodeOrError(code: string): Promise<UserDocument> {
    console.log('findByCode: ', code);
    let resultUser = await UserModel.findOne({
      'confirmationEmail.confirmationCode': code,
    });
    if (!resultUser) {
      throw new RepositoryNotFoundError('User not found', 'user');
    }
    return resultUser;
  }

  async findByRecoveryCodeOrError(code: string): Promise<UserDocument> {
    console.log('findByCode: ', code);
    let resultUser = await UserModel.findOne({
      'passwordRecovery.confirmationCode': code,
    });
    if (!resultUser) {
      throw new RepositoryNotFoundError('User not found', 'user');
    }
    return resultUser;
  }
}
