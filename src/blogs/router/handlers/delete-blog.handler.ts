import { RequestWithParams } from '../../../core/types/requestTypes';
import { Response } from 'express';
import { BlogOutput } from '../output/blog.output';
import { ErroreType } from '../../types/validationError';
import { blogsService } from '../../../composition-root';
import { HttpStatus } from '../../../core/types/http-statuses';
import { errorsHandler } from '../../../core/errors/errors.handler';

export async function deleteBlogHandler(
  req: RequestWithParams<{ id: string }>,
  res: Response<BlogOutput | ErroreType>,
) {
  try {
    const id = req.params.id;
    await blogsService.delete(id);
    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
