import { errorsHandler } from '../../../core/errors/errors.handler';
import { Request, Response } from 'express';
import { commentsQueryRepository } from '../../repositories/comments.query-repository';
import { HttpStatus } from '../../../core/types/http-statuses';

export async function getCommentHandler(req: Request, res: Response) {
  try {
    let comment = await commentsQueryRepository.findByIdOrError(req.params.id);
    res.status(HttpStatus.Ok).send(comment);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
