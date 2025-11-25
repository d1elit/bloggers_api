import { Response } from 'express';
import { injectable } from 'inversify';
import { BlogsService } from '../application/blogs.service';
import { BlogsQueryRepository } from '../repositories/blogs.query-repository';
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithParamsAndQuery,
  RequestWithQuery,
} from '../../core/types/requestTypes';
import { BlogInput } from './input/blog.input';
import { HttpStatus } from '../../core/types/http-statuses';
import { mapToBlogViewModel } from './mappers/map-to-blog-view-model';
import { BlogOutput } from './output/blog.output';
import { errorsHandler } from '../../core/errors/errors.handler';
import { PostOutput } from '../../posts/router/output/post.output';
import { mapToPostViewModel } from '../../posts/router/mappers/map-to-post-view-model';
import { ErroreType } from '../types/validationError';
import { setDefaultSortAndPaginationIfNotExist } from '../../core/helpers/set-default-query-params';
import { BlogListPaginatedOutput } from './output/blog-list-paginated.output';
import { BlogQueryInput } from './input/blog-query.input';
import { PostQueryInput } from '../../posts/router/input/post-query.input';
import { postListPaginatedOutput } from '../../posts/router/output/post-list-paginated.output';
import { PostsQueryRepository } from '../../posts/repositories/posts.query-repository';

@injectable()
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  async createBlog(req: RequestWithBody<BlogInput>, res: Response) {
    try {
      const createdBlogId = await this.blogsService.create(req.body);

      const blogViewModel =
        await this.blogsQueryRepository.findByIdOrError(createdBlogId);

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
      const createdPostInBlog = await this.blogsService.createPost(
        req.params.id,
        req.body,
      );
      const postViewModel: PostOutput = mapToPostViewModel(createdPostInBlog);
      res.status(HttpStatus.Created).send(postViewModel);
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
      const blogViewModel = mapToBlogViewModel(blog);
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
      const id = req.params.id;
      await this.blogsQueryRepository.findByIdOrError(id);
      const posts = await this.postsQueryRepository.findAll(queryInput, id);
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
