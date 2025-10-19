import { Request, Response, NextFunction } from 'express';
import { jwtService } from '../adapters/jwt.service';
import { idType } from '../types/id';
import { errorsHandler } from '../../core/errors/errors.handler';

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

      req.user = { id: userId } as idType;
      next();

      return;
    }
    res.sendStatus(401);

    return;
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
