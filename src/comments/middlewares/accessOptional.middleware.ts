import { NextFunction, Request, Response } from 'express';
import { userIdType } from '../../auth/types/userIdType';
import { errorsHandler } from '../../core/errors/errors.handler';
import { container } from '../../composition-root';
import { JwtService } from '../../auth/adapters/jwt.service';
import { LikesRepository } from '../repositories/likes.repository';

const jwtService = container.get(JwtService);
const likesRepository = container.get(LikesRepository);
export const AccessOptionalMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.headers.authorization) {
      req.user = { likeStatus: 'None' } as userIdType;
      next();
      return;
    }

    console.log('I"m her in optional access');
    const [authType, token] = req.headers.authorization.split(' ');
    const payload = await jwtService.verifyToken(token);
    if (payload) {
      req.user = { userId: payload.userId } as userIdType;
      const { userId } = payload;
      const commentId = req.params.id;
      let like = await likesRepository.find(userId, commentId);

      if (like) {
        req.user = {
          likeStatus: like.myStatus,
          userId: payload.userId,
        } as userIdType;
        next();

        return;
      }
      req.user = { likeStatus: 'None', userId: payload.userId } as userIdType;

      next();

      return;
    }
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
