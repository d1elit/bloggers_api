import { HydratedDocument, model, Model } from 'mongoose';

import mongoose from 'mongoose';
import { UserInput } from '../router/dto/input/user.input';
import { add } from 'date-fns';

export const UserSchema = new mongoose.Schema<UserEntity>({
  login: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: String, required: true },
  confirmationEmail: {
    confirmationCode: { type: String, required: true },
    isConfirmed: { type: Boolean, required: true },
    expirationDate: { type: String, required: true },
  },
  passwordRecovery: {
    confirmationCode: { type: String, required: false },
    isUsed: { type: Boolean, required: false },
    expirationDate: { type: String, required: false },
  },
});

export class UserEntity {
  login!: string;
  password!: string;
  email!: string;
  createdAt!: string;
  confirmationEmail!: {
    confirmationCode: string;
    isConfirmed: boolean;
    expirationDate: string;
  };
  passwordRecovery!: {
    confirmationCode: string;
    isUsed: boolean;
    expirationDate: string;
  };
  static createNew(
    userDto: UserInput,
    hashedPassword: string,
    confirmationCode?: string,
  ) {
    const user = new UserEntity();
    user.login = userDto.login;
    user.password = hashedPassword;
    user.email = userDto.email;
    user.createdAt = new Date().toISOString();
    user.confirmationEmail = {
      confirmationCode: confirmationCode || crypto.randomUUID(),
      isConfirmed: false,
      expirationDate: add(new Date(), {
        hours: 1,
        minutes: 3,
      }).toISOString(),
    };
    user.passwordRecovery = {
      confirmationCode: confirmationCode || crypto.randomUUID(),
      isUsed: false,
      expirationDate: add(new Date(), {
        hours: 1,
      }).toISOString(),
    };

    return user;
  }
}

type UserModel = Model<UserEntity>;

export type UserDocument = HydratedDocument<UserEntity>;

UserSchema.loadClass(UserEntity);

export const UserModel = model<UserEntity, UserModel>('users', UserSchema);
