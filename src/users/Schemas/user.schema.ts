import { HydratedDocument, model, Model } from 'mongoose';
import { User } from '../types/user';
import mongoose from 'mongoose';

type UserModel = Model<User>;

export type UserDocument = HydratedDocument<User>;

export const UserSchema = new mongoose.Schema<User>({
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

export const UserModel = model<User, UserModel>('users', UserSchema);
