import { Request, Response } from 'express';
import { blogsService } from '../../application/blogs.service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-query-params';
import { PostQueryInput } from '../../../posts/router/input/post-query.input';
import { postListPaginatedOutput } from '../../../posts/router/output/post-list-paginated.output';
import { mapToPostListPaginated } from '../../../posts/router/mappers/map-to-post-list-paginated';
import { RequestWithParamsAndQuery } from '../../../core/types/requestTypes';

export async function getBlogsPostList(
  req: RequestWithParamsAndQuery<{ id: string }, PostQueryInput>,
  res: Response<postListPaginatedOutput>,
) {
  try {
    const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);

    const id = req.params.id;
    const { items, totalCount } = await blogsService.findPosts(queryInput, id);
    const postOutput = mapToPostListPaginated(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });
    res.send(postOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
