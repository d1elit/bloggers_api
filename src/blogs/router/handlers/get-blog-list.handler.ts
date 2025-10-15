import { Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-query-params';
import { mapToBlogViewModel } from '../mappers/map-to-blog-list-paginated.util';
import { BlogListPaginatedOutput } from '../output/blog-list-paginated.output';
import { RequestWithQuery } from '../../../core/types/requestTypes';
import { BlogQueryInput } from '../input/blog-query.input';
import {blogsQueryRepository} from "../../repositories/blogs.query-repository";

export async function getBlogsListHandler(
  req: RequestWithQuery<BlogQueryInput>,
  res: Response<BlogListPaginatedOutput>,
) {
  try {
    const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);

    const { items, totalCount } = await blogsQueryRepository.findAll(queryInput);

    const blogsViewModels = mapToBlogViewModel(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });

    res.status(HttpStatus.Ok).send(blogsViewModels);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
