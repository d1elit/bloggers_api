import { usersCollection } from '../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb';
import { User } from '../types/user';
import { RepositoryNotFoundError } from '../../core/errors/domain.errors';

export const usersRepository = {
  async create(newUser: User): Promise<WithId<User>> {
    const insertResult = await usersCollection.insertOne(newUser);
    console.log('USER CREATED SUCCESS');
    console.log('USER INFO', newUser.confirmationEmail.confirmationCode);
    return { ...newUser, _id: insertResult.insertedId };
  },

  async delete(id: string) {
    await usersCollection.deleteOne({ _id: new ObjectId(id) });
    return;
  },
  async findFieldWithValue(
    fieldName: string,
    fieldValue: string,
  ): Promise<WithId<User> | null> {
    return await usersCollection.findOne({ [fieldName]: fieldValue });
  },
  async findByLoginOrEmail(loginOrEmail: string): Promise<WithId<User> | null> {
    return usersCollection.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });
  },
  async findByIdOrError(userId: string): Promise<WithId<User>> {
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      throw new RepositoryNotFoundError('User not found', 'user');
    }
    return user;
  },

  async updateConfirmationStatus(_id: ObjectId) {
    await usersCollection.updateOne(
      { _id },
      { $set: { 'confirmationEmail.isConfirmed': true } },
    );
  },

  async updateConfirmationCode(_id: ObjectId, code: string) {
    await usersCollection.updateOne(
      { _id },
      { $set: { 'confirmationEmail.confirmationCode': code } },
    );
  },
  async findByCodeOrError(code: string): Promise<WithId<User>> {
    console.log('findByCode: ', code);
    let resultUser = await usersCollection.findOne({
      'confirmationEmail.confirmationCode': code,
    });
    if (!resultUser) {
      throw new RepositoryNotFoundError('User not found', 'user');
    }
    return resultUser;
  },
};
