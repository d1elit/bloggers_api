import { NextFunction, Request, Response } from 'express';
import { userIdType } from '../types/userIdType';
import { errorsHandler } from '../../core/errors/errors.handler';
import { container } from '../../composition-root';
import { JwtService } from '../adapters/jwt.service';
import { LikesRepository } from '../../comments/infrasctructure/repositories/likes.repository';
import { PostLikesRepository } from '../../posts/infrasturcture/repositories/post-likes.repository';

const jwtService = container.get(JwtService);
const likesRepository = container.get(LikesRepository);
const postLikeRepo = container.get(PostLikesRepository);
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

    const [authType, token] = req.headers.authorization.split(' ');

    const payload = await jwtService.verifyToken(token);
    if (payload) {
      req.user = { userId: payload.userId } as userIdType;
      const { userId } = payload;
      const commentId = req.params.id;
      let like;
      if (req.originalUrl.includes('comments')) {
        like = await likesRepository.find(userId, commentId);
      } else {
        like = await postLikeRepo.find(userId, req.params.id);
      }

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
