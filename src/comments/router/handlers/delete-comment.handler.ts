import { errorsHandler } from '../../../core/errors/errors.handler';
import { Request, Response } from 'express';
import { commentsService } from '../../application/comments.service';
import { HttpStatus } from '../../../core/types/http-statuses';

export async function deleteCommentHandler(req: Request, res: Response) {
  try {
    let userId = req.user?.id as string;
    let commentId = req.params.id;
    await commentsService.delete(commentId, userId);
    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
