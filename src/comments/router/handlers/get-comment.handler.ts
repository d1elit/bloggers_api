import { errorsHandler } from '../../../core/errors/errors.handler';
import { Request, Response } from 'express';

import { HttpStatus } from '../../../core/types/http-statuses';
import { commentsQueryRepository } from '../../../composition-root';

export async function getCommentHandler(req: Request, res: Response) {
  try {
    let comment = await commentsQueryRepository.findByIdOrError(req.params.id);
    res.status(HttpStatus.Ok).send(comment);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
