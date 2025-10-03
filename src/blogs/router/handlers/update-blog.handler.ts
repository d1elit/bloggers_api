import { blogsService } from '../../application/blogs.service';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validtion-result.middleware';
import { HttpStatus } from '../../../core/types/http-statuses';
import { Response } from 'express';
import { RequestWithParamsAndBody } from '../../../core/types/requestTypes';
import { BlogInputModel } from '../../models/blogInputModel';
import { errorsHandler } from '../../../core/errors/errors.handler';

export async function updateBlogHandler(
  req: RequestWithParamsAndBody<{ id: string }, BlogInputModel>,
  res: Response,
) {
  try {
    const id = req.params.id;
    await blogsService.update(id, req.body);
    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
