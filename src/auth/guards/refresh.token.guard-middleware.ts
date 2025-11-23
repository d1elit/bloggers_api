import { NextFunction, Request, Response } from 'express';
import { errorsHandler } from '../../core/errors/errors.handler';
import { HttpStatus } from '../../core/types/http-statuses';
import { userIdType } from '../types/userIdType';
import { container } from '../../composition-root';
import { AuthService } from '../application/auth.service';
import { JwtService } from '../adapters/jwt.service';
const authService = container.get(AuthService); // <--- Берем из контейнера
const jwtService = container.get(JwtService);
export const refreshTokenGuardMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(HttpStatus.Unauthorized);

    // const ip = req.ip || req.socket.remoteAddress || 'unknown';
    // const deviceName = req.headers['user-agent'];

    const payload = await jwtService.verifyRefreshToken(refreshToken);

    if (!payload) return res.sendStatus(HttpStatus.Unauthorized);

    // await authService.ensureTokenNotRevoked(refreshToken);

    await authService.ensureRefreshTokenValid(payload, refreshToken);

    req.user = {
      userId: payload.userId,
      deviceId: payload.deviceId,
    } as userIdType;
    next();
    return;
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
