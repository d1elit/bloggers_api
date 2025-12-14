import { User } from '../../domain/types/user';
import { RepositoryNotFoundError } from '../../../core/errors/domain.errors';
import { add } from 'date-fns';
import { injectable } from 'inversify';
import { UserDocument, UserEntity, UserModel } from '../../domain/userEntity';

@injectable()
export class UsersRepository {
  async create(newUser: UserEntity): Promise<UserDocument> {
    const user = await UserModel.create(newUser);
    console.log('USER CREATED SUCCESS');
    console.log('USER INFO', newUser.confirmationEmail.confirmationCode);
    return user;
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

  async updateConfirmationStatus(_id: string) {
    await UserModel.updateOne(
      { _id },
      { $set: { 'confirmationEmail.isConfirmed': true } },
    );
  }

  async updateRecoveryCode(_id: string, code: string) {
    await UserModel.updateOne(
      { _id },
      {
        $set: {
          'passwordRecovery.confirmationCode': code,
          'passwordRecovery.expirationDate': add(new Date(), {
            hours: 1,
          }).toISOString(),
        },
      },
    );
  }

  async updateRecoveryStatus(_id: string) {
    await UserModel.updateOne(
      { _id },
      { $set: { 'passwordRecovery.confirmationCode': '' } },
    );
  }

  async updatePassword(_id: string, password: string) {
    await UserModel.updateOne({ _id }, { $set: { password: password } });
  }

  async updateConfirmationCode(_id: string, code: string) {
    await UserModel.updateOne(
      { _id },
      { $set: { 'confirmationEmail.confirmationCode': code } },
    );
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
