import { Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-query-params';
import { BlogListPaginatedOutput } from '../output/blog-list-paginated.output';
import { RequestWithQuery } from '../../../core/types/requestTypes';
import { BlogQueryInput } from '../input/blog-query.input';
import { blogsQueryRepository } from '../../../composition-root';

export async function getBlogsListHandler(
  req: RequestWithQuery<BlogQueryInput>,
  res: Response<BlogListPaginatedOutput>,
) {
  try {
    const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);

    const blogs = await blogsQueryRepository.findAll(queryInput);

    res.status(HttpStatus.Ok).send(blogs);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
