import { RequestWithParams } from '../../../core/types/requestTypes';
import { HttpStatus } from '../../../core/types/http-statuses';
import { Response } from 'express';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { postsService } from '../../../composition-root';

export async function deletePostHandler(
  req: RequestWithParams<{ id: string }>,
  res: Response,
) {
  try {
    const id = req.params.id;
    await postsService.delete(id);
    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
