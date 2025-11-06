import { SETTINGS } from '../../core/settings/settings';
import jwt from 'jsonwebtoken';
import { LoginError } from '../../core/errors/domain.errors';
import {refreshTokenPayload} from "../types/refreshTokenPayload";

export const jwtService = {
  async createAccessToken(userId: string): Promise<string> {
    return jwt.sign({ userId }, SETTINGS.AC_SECRET, {
      expiresIn: `${SETTINGS.AC_TIME}s`,
    });
  },
  async createRefreshToken(userId: string,deviceId:string): Promise<string> {
    return jwt.sign({deviceId, userId }, SETTINGS.RF_SECRET, {
      expiresIn: `${SETTINGS.RF_TIME}s`,
    });
  },

  async verifyToken(token: string): Promise<{ userId: string } | null> {
    try {
      return jwt.verify(token, SETTINGS.AC_SECRET) as { userId: string };
    } catch (e: unknown) {
      throw new LoginError('Unauthorized access token');
    }
  },
  async verifyRefreshToken(
    refreshToken: string,
  ): Promise<{ userId:string, deviceId:string, iat:number, exp:number } | null> {
    try {
      return jwt.verify(refreshToken, SETTINGS.RF_SECRET) as refreshTokenPayload;
    } catch (e: unknown) {
      throw new LoginError('Unauthorized refresh token');
    }
  },
};
