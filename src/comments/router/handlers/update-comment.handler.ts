import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { commentsService } from '../../application/comments.service';
import { HttpStatus } from '../../../core/types/http-statuses';

export async function updateCommentHandler(req: Request, res: Response) {
  try {
    const userId = req.user?.id as string;
    const commentId = req.params.id;
    await commentsService.update(commentId, userId, req.body);
    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
