import { Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { RequestWithParams } from '../../../core/types/requestTypes';
import { mapToBlogViewModel } from '../mappers/map-to-blog-view-model';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { blogsQueryRepository } from '../../../composition-root';

export async function getBlogHandler(
  req: RequestWithParams<{ id: string }>,
  res: Response,
) {
  try {
    const id = req.params.id;
    const blog = await blogsQueryRepository.findByIdOrError(id);
    const blogViewModel = mapToBlogViewModel(blog);
    res.status(HttpStatus.Ok).send(blogViewModel);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
