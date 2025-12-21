import { Response } from 'express';
import { injectable } from 'inversify';
import { BlogsService } from '../application/blogs.service';
import { BlogsQueryRepository } from '../infrasturcture/repositories/blogs.query-repository';
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithParamsAndQuery,
  RequestWithQuery,
} from '../../core/types/requestTypes';
import { BlogInput } from './dto/input/blog.input';
import { HttpStatus } from '../../core/types/http-statuses';
import { mapToBlogView } from './dto/mappers/map-to-blog-view-model';
import { BlogOutput } from './dto/output/blog.output';
import { errorsHandler } from '../../core/errors/errors.handler';

import { ErroreType } from '../types/validationError';
import { setDefaultSortAndPaginationIfNotExist } from '../../core/helpers/set-default-query-params';
import { BlogListPaginatedOutput } from './dto/output/blog-list-paginated.output';
import { BlogQueryInput } from './dto/input/blog-query.input';
import { PostQueryInput } from '../../posts/router/dto/input/post-query.input';
import { postListPaginatedOutput } from '../../posts/router/dto/output/post-list-paginated.output';
import { PostsQueryRepository } from '../../posts/infrasturcture/repositories/posts.query-repository';
import { PostsService } from '../../posts/application/posts.service';

@injectable()
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly postService: PostsService,
  ) {}

  async createBlog(req: RequestWithBody<BlogInput>, res: Response) {
    try {
      const createdBlogId = await this.blogsService.create(req.body);

      const blogViewModel =
        await this.blogsQueryRepository.findMappedOrError(createdBlogId);

      res.status(HttpStatus.Created).send(blogViewModel);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async createPostInBlog(
    req: RequestWithParams<{ id: string }>,
    res: Response,
  ) {
    try {
      const createdPost = await this.postService.create(
        req.body,
        req.params.id,
      );
      const post = await this.postsQueryRepository.findByIdOrError(createdPost);

      res.status(HttpStatus.Created).send(post);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async deleteBlog(
    req: RequestWithParams<{ id: string }>,
    res: Response<BlogOutput | ErroreType>,
  ) {
    try {
      const id = req.params.id;
      await this.blogsService.delete(id);
      res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async getBlogsList(
    req: RequestWithQuery<BlogQueryInput>,
    res: Response<BlogListPaginatedOutput>,
  ) {
    try {
      const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);
      const blogs = await this.blogsQueryRepository.findAll(queryInput);
      res.status(HttpStatus.Ok).send(blogs);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async getBlog(req: RequestWithParams<{ id: string }>, res: Response) {
    try {
      const id = req.params.id;
      const blog = await this.blogsQueryRepository.findByIdOrError(id);
      const blogViewModel = mapToBlogView(blog);
      res.status(HttpStatus.Ok).send(blogViewModel);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async getBlogsPostList(
    req: RequestWithParamsAndQuery<
      {
        id: string;
      },
      PostQueryInput
    >,
    res: Response<postListPaginatedOutput>,
  ) {
    try {
      const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);
      const blogId = req.params.id;
      const userId = req.user.userId as string;
      await this.blogsQueryRepository.findByIdOrError(blogId);
      const posts = await this.postsQueryRepository.findAll({
        queryDto: queryInput,
        blogId,
        userId,
      });
      res.status(HttpStatus.Ok).send(posts);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async updateBlog(
    req: RequestWithParamsAndBody<{ id: string }, BlogInput>,
    res: Response,
  ) {
    try {
      const id = req.params.id;
      await this.blogsService.update(id, req.body);
      res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }
}
