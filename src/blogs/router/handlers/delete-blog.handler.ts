import { RequestWithParams } from '../../../core/types/requestTypes';
import { Response } from 'express';
import { BlogViewModel } from '../../models/blogVIewModel';
import { ErroreType } from '../../types/validationError';
import { blogsService } from '../../application/blogs.service';
import { HttpStatus } from '../../../core/types/http-statuses';
import { errorsHandler } from '../../../core/errors/errors.handler';

export async function deleteBlogHandler(
  req: RequestWithParams<{ id: string }>,
  res: Response<BlogViewModel | ErroreType>,
) {
  try {
    const id = req.params.id;
    await blogsService.delete(id);
    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
