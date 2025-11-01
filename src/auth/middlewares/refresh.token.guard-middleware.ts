import { NextFunction, Request, Response } from 'express';
import { errorsHandler } from '../../core/errors/errors.handler';
import { HttpStatus } from '../../core/types/http-statuses';
import { idType } from '../types/id';
import { jwtService } from '../adapters/jwt.service';
import { authService } from '../application/auth.service';

export const refreshTokenGuardMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(HttpStatus.Unauthorized);

    await authService.isTokenRevoked(refreshToken);

    const payload = await jwtService.verifyRefreshToken(refreshToken);

    if (!payload) return res.sendStatus(HttpStatus.Unauthorized);

    const { userId } = payload;

    req.user = { id: userId } as idType;
    next();
    return;
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
