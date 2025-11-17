import { errorsHandler } from '../../../core/errors/errors.handler';
import { Request, Response } from 'express';

import { HttpStatus } from '../../../core/types/http-statuses';
import { commentsQueryRepository } from '../../../composition-root';

export async function getCommentListHandler(req: Request, res: Response) {
  try {
    const result = await commentsQueryRepository.testFindAll();
    res.status(HttpStatus.Ok).send(result);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
