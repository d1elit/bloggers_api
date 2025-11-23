import { Request, Response } from 'express';
import { injectable } from 'inversify';
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithParamsAndQuery,
  RequestWithQuery,
} from '../../core/types/requestTypes';
import { HttpStatus } from '../../core/types/http-statuses';
import { errorsHandler } from '../../core/errors/errors.handler';
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository } from '../repositories/posts.query-repository';
import { CommentsQueryRepository } from '../../comments/repositories/comments.query-repository';
import { PostInput } from './input/post.input';
import { mapToPostViewModel } from './mappers/map-to-post-view-model';
import { PostOutput } from './output/post.output';
import { setDefaultSortAndPaginationIfNotExist } from '../../core/helpers/set-default-query-params';
import { PostQueryInput } from './input/post-query.input';
import { postListPaginatedOutput } from './output/post-list-paginated.output';
import { CommentQueryInput } from '../../comments/router/input/comment-query.input';

@injectable()
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  async createPost(req: RequestWithBody<PostInput>, res: Response) {
    try {
      const createdPost = await this.postsService.create(req.body);
      const postViewModel: PostOutput = mapToPostViewModel(createdPost);
      res.status(HttpStatus.Created).send(postViewModel);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async createPostsComment(req: Request, res: Response) {
    try {
      console.log('USER:ID:', req.user.id);
      const userId = req.user?.userId as string;
      const commentId = await this.postsService.createComment(
        req.params.id,
        req.body,
        userId,
      );
      const comment =
        await this.commentsQueryRepository.findByIdOrError(commentId);
      res.status(HttpStatus.Created).send(comment);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async deletePost(req: RequestWithParams<{ id: string }>, res: Response) {
    try {
      const id = req.params.id;
      await this.postsService.delete(id);
      res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async getPostList(
    req: RequestWithQuery<PostQueryInput>,
    res: Response<postListPaginatedOutput>,
  ) {
    try {
      const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);
      const posts = await this.postsQueryRepository.findAll(queryInput);
      res.status(HttpStatus.Ok).send(posts);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async getPost(
    req: RequestWithParams<{ id: string }>,
    res: Response<PostOutput>,
  ) {
    try {
      const id = req.params.id;
      const post = await this.postsQueryRepository.findByIdOrError(id);
      const postViewModel = mapToPostViewModel(post);
      res.status(HttpStatus.Ok).send(postViewModel);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async getPostsCommentList(
    req: RequestWithParamsAndQuery<{ id: string }, CommentQueryInput>,
    res: Response,
  ) {
    try {
      const postId = req.params.id;
      await this.postsQueryRepository.findByIdOrError(postId);
      const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);
      const comments = await this.commentsQueryRepository.findAll(
        queryInput,
        postId,
      );
      res.status(HttpStatus.Ok).send(comments);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async updatePost(
    req: RequestWithParamsAndBody<{ id: string }, PostInput>,
    res: Response,
  ) {
    try {
      const id = req.params.id;
      await this.postsService.update(id, req.body);
      res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }
}
