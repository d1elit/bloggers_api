import { Request, Response } from 'express';
import { injectable } from 'inversify';
import { CommentsService } from '../application/comments.service';
import { CommentsQueryRepository } from '../repositories/comments.query-repository';
import { errorsHandler } from '../../core/errors/errors.handler';
import { HttpStatus } from '../../core/types/http-statuses';
import {
  RequestWithParams,
  RequestWithBody,
} from '../../core/types/requestTypes';
import { CommentInput } from './input/comment.input';
import { CommentListPaginatedOutput } from './output/comment-list-paginated.output';

@injectable()
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  async deleteComment(req: RequestWithParams<{ id: string }>, res: Response) {
    try {
      const userId = req.user?.id as string;
      const commentId = req.params.id;
      await this.commentsService.delete(commentId, userId);
      res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async getCommentList(req: Request, res: Response) {
    try {
      const result = await this.commentsQueryRepository.testFindAll(); // TODO: This should likely take query params
      res.status(HttpStatus.Ok).send(result);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async getComment(req: RequestWithParams<{ id: string }>, res: Response) {
    try {
      const comment = await this.commentsQueryRepository.findByIdOrError(
        req.params.id,
      );
      res.status(HttpStatus.Ok).send(comment);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async updateComment(
    req: RequestWithParams<{ id: string }> & RequestWithBody<CommentInput>,
    res: Response,
  ) {
    try {
      const userId = req.user?.id as string;
      const commentId = req.params.id;
      await this.commentsService.update(commentId, userId, req.body);
      res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }
}
