import { CommentsQueryRepository } from './comments/repositories/comments.query-repository';
import { CommentsRepository } from './comments/repositories/comments.repository';
import { CommentsService } from './comments/application/comments.service';
import { BlogsRepository } from './blogs/repositories/blogs.repository';
import { BlogsQueryRepository } from './blogs/repositories/blogs.query-repository';
import { BlogsService } from './blogs/application/blogs.service';
import { PostsRepository } from './posts/repositories/posts.repository';
import { PostsService } from './posts/application/posts.service';
import { PostsQueryRepository } from './posts/repositories/posts.query-repository';

export const blogsRepository = new BlogsRepository();
export const blogsQueryRepository = new BlogsQueryRepository();

export const postsRepository = new PostsRepository();
export const postsQueryRepository = new PostsQueryRepository();

export const commentsQueryRepository = new CommentsQueryRepository();
export const commentsRepository = new CommentsRepository();

export const blogsService = new BlogsService(blogsRepository, postsRepository);

export const commentsService = new CommentsService(commentsRepository);

export const postsService = new PostsService(
  blogsRepository,
  postsRepository,
  commentsRepository,
);
