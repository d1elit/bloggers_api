import { RequestWithParamsAndBody } from '../../../core/types/requestTypes';
import { Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { PostInputModel } from '../../models/postInputModel';
import { postsService } from '../../application/posts.service';
import { errorsHandler } from '../../../core/errors/errors.handler';

export async function updatePostHandler(
  req: RequestWithParamsAndBody<{ id: string }, PostInputModel>,
  res: Response,
) {
  try {
    const id = req.params.id;
    await postsService.update(id, req.body);
    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
