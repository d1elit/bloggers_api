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
      console.log(`Im here after likes: ${like}`);
      console.log('AFter likes user id', req.user);
      if (like) {
        req.user = {
          likeStatus: like.myStatus,
          userId: payload.userId,
        } as userIdType;
        next();

        return;
      }
      req.user = { likeStatus: 'None', userId: payload.userId } as userIdType;
      console.log('GO OUT');
      console.log('AFter likes 2 user id', req.user);
      next();

      return;
    }

    // const userId = req.user.userId;
    //
    // if (!userId) {
    //   next();
    // }

    // if (myStatus) {}
    // const [authType, token] = req.headers.authorization.split(' ');
    //
    // if (token) {
    //   const payload = await jwtService.verifyToken(token);
    //
    //   if (payload) {
    //     // console.log('ALL WE HERE  1', payload);
    //     const { userId } = payload;
    //     // console.log('ALL WE HERE  2', userId);
    //
    //     req.user = { userId: userId } as userIdType;
    //     next();
    //
    //     return;
    //   }
    //   res.sendStatus(401);
    //
    //   return;
    // }
    // return;
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
