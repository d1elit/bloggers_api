import { NextFunction, Request, Response } from 'express';
import { userIdType } from '../types/userIdType';
import { errorsHandler } from '../../core/errors/errors.handler';
import { jwtService } from '../../composition-root';

export const AccsessTokenGuardMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.headers.authorization) return res.sendStatus(401);

    const [authType, token] = req.headers.authorization.split(' ');
    if (authType !== 'Bearer') return res.sendStatus(401);

    const payload = await jwtService.verifyToken(token);

    if (payload) {
      const { userId } = payload;

      req.user = { userId: userId } as userIdType;
      next();

      return;
    }
    res.sendStatus(401);

    return;
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
