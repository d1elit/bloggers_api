import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { HttpStatus } from '../../../core/types/http-statuses';
import { usersQueryRepository } from '../../../composition-root';

export async function getAuthMeHandler(req: Request, res: Response) {
  try {
    const userId = req.user?.userId as string;
    if (!userId) return res.sendStatus(HttpStatus.Unauthorized);
    const me = await usersQueryRepository.findByIdOrError(userId);
    const meView = {
      email: me?.email,
      login: me?.login,
      userId: me?._id.toString(),
    };
    return res.status(HttpStatus.Ok).send(meView);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
