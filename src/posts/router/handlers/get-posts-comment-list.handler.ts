import { errorsHandler } from '../../../core/errors/errors.handler';
import { Response } from 'express';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-query-params';
import { RequestWithParamsAndQuery } from '../../../core/types/requestTypes';
import { CommentQueryInput } from '../../../comments/router/input/comment-query.input';
import { HttpStatus } from '../../../core/types/http-statuses';
import {
  commentsQueryRepository,
  postsQueryRepository,
} from '../../../composition-root';

export async function getPostsCommentListHandler(
  req: RequestWithParamsAndQuery<{ id: string }, CommentQueryInput>,
  res: Response,
) {
  try {
    const postId = req.params.id;
    await postsQueryRepository.findByIdOrError(postId);
    const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);
    const comments = await commentsQueryRepository.findAll(queryInput, postId);
    res.status(HttpStatus.Ok).send(comments);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
