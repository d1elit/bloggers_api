import { RequestWithBody } from '../../../core/types/requestTypes';
import { BlogInput } from '../input/blog.input';
import { HttpStatus } from '../../../core/types/http-statuses';
import { Response } from 'express';
import { mapToBlogViewModel } from '../mappers/map-to-blog-view-model';
import { BlogOutput } from '../output/blog.output';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { blogsService } from '../../../composition-root';

export async function createBlogHandler(
  req: RequestWithBody<BlogInput>,
  res: Response,
) {
  try {
    const createdBlog = await blogsService.create(req.body);
    const blogViewModel: BlogOutput = mapToBlogViewModel(createdBlog);
    res.status(HttpStatus.Created).send(blogViewModel);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
