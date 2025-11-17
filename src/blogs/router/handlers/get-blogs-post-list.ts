import { Response } from 'express';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-query-params';
import { PostQueryInput } from '../../../posts/router/input/post-query.input';
import { postListPaginatedOutput } from '../../../posts/router/output/post-list-paginated.output';
import { RequestWithParamsAndQuery } from '../../../core/types/requestTypes';
import { HttpStatus } from '../../../core/types/http-statuses';
import {
  blogsQueryRepository,
  postsQueryRepository,
} from '../../../composition-root';

export async function getBlogsPostList(
  req: RequestWithParamsAndQuery<{ id: string }, PostQueryInput>,
  res: Response<postListPaginatedOutput>,
) {
  try {
    const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);

    const id = req.params.id;

    await blogsQueryRepository.findByIdOrError(id);
    const posts = await postsQueryRepository.findAll(queryInput, id);

    res.status(HttpStatus.Ok).send(posts);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
