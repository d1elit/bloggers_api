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

  confirmEmail() {
    this.confirmationEmail.isConfirmed = true;
  }
  isEmailConfirmed(): boolean {
    console.log('isEmailConfirmed', this.confirmationEmail.isConfirmed);
    return this.confirmationEmail.isConfirmed;
  }
  isEmailConfirmationExpired(): boolean {
    return new Date() > new Date(this.confirmationEmail.expirationDate);
  }
  updateEmailConfirmationCode(newCode: string): void {
    this.confirmationEmail.confirmationCode = newCode;
    this.confirmationEmail.expirationDate = add(new Date(), {
      hours: 1,
      minutes: 3,
    }).toISOString();
  }
  canConfirmEmail(code: string): { isValid: boolean; error?: string } {
    if (this.isEmailConfirmed()) {
      console.log('YES)');
      return { isValid: false, error: 'Email already confirmed' };
    }
    if (code !== this.confirmationEmail.confirmationCode) {
      return { isValid: false, error: 'Wrong confirmation code' };
    }
    if (this.isEmailConfirmationExpired()) {
      return { isValid: false, error: 'Confirmation code expired' };
    }
    return { isValid: true };
  }
  updatePasswordRecoveryCode(newCode: string): void {
    this.passwordRecovery.confirmationCode = newCode;
    this.passwordRecovery.isUsed = false;
    this.passwordRecovery.expirationDate = add(new Date(), {
      hours: 1,
    }).toISOString();
  }

  isPasswordRecoveryExpired(): boolean {
    return new Date() > new Date(this.passwordRecovery.expirationDate);
  }

  canRecoverPassword(code: string): { isValid: boolean; error?: string } {
    if (this.passwordRecovery.isUsed) {
      return { isValid: false, error: 'Recovery code already used' };
    }
    if (code !== this.passwordRecovery.confirmationCode) {
      return { isValid: false, error: 'Wrong recovery code' };
    }
    if (this.isPasswordRecoveryExpired()) {
      return { isValid: false, error: 'Recovery code expired' };
    }
    return { isValid: true };
  }

  updatePassword(hashedPassword: string): void {
    this.password = hashedPassword;
    this.passwordRecovery.isUsed = true;
  }
}

type UserModel = Model<UserEntity>;

export type UserDocument = HydratedDocument<UserEntity>;

UserSchema.loadClass(UserEntity);

export const UserModel = model<UserEntity, UserModel>('users', UserSchema);
