import { SETTINGS } from '../../core/settings/settings';
import jwt from 'jsonwebtoken';
import { LoginError } from '../../core/errors/domain.errors';

export const jwtService = {
  async createToken(userId: string): Promise<string> {
    // @ts-ignore
    return jwt.sign({ userId }, SETTINGS.AC_SECRET, {
      expiresIn: SETTINGS.AC_TIME,
    });
  },

  async verifyToken(token: string): Promise<{ userId: string } | null> {
    try {
      return jwt.verify(token, SETTINGS.AC_SECRET) as { userId: string };
    } catch (e: unknown) {
      throw new LoginError('Unauthorized in jwt');
    }
  },
};
