import { RequestWithParamsAndBody } from '../../../core/types/requestTypes';
import { Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { PostInput } from '../input/post.input';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { postsService } from '../../../composition-root';

export async function updatePostHandler(
  req: RequestWithParamsAndBody<{ id: string }, PostInput>,
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
