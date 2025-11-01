import { Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-query-params';
import { PostQueryInput } from '../input/post-query.input';
import { postListPaginatedOutput } from '../output/post-list-paginated.output';
import { RequestWithQuery } from '../../../core/types/requestTypes';
import { postsQueryRepository } from '../../repositories/posts.query-repository';

export async function getPostListHandler(
  req: RequestWithQuery<PostQueryInput>,
  res: Response<postListPaginatedOutput>,
) {
  try {
    const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);
    const posts = await postsQueryRepository.findAll(queryInput);
    res.status(HttpStatus.Ok).send(posts);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
