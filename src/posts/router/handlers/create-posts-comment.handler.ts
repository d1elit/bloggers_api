import { errorsHandler } from '../../../core/errors/errors.handler';
import { Request, Response } from 'express';
import { postsService } from '../../application/posts.service';
import { HttpStatus } from '../../../core/types/http-statuses';
import { commentsQueryRepository } from '../../../comments/repositories/comments.query-repository';

export async function createPostsCommentHandler(req: Request, res: Response) {
  try {
    let userId = req.user?.id as string;
    let commentId = await postsService.createComment(
      req.params.id,
      req.body,
      userId,
    );
    let comment = await commentsQueryRepository.findByIdOrError(commentId);
    res.status(HttpStatus.Created).send(comment);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
