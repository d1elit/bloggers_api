import { CommentsQueryRepository } from './comments/repositories/comments.query-repository';
import { CommentsRepository } from './comments/repositories/comments.repository';
import { CommentsService } from './comments/application/comments.service';
import { BlogsRepository } from './blogs/repositories/blogs.repository';
import { BlogsQueryRepository } from './blogs/repositories/blogs.query-repository';
import { BlogsService } from './blogs/application/blogs.service';
import { PostsRepository } from './posts/repositories/posts.repository';
import { PostsService } from './posts/application/posts.service';
import { PostsQueryRepository } from './posts/repositories/posts.query-repository';
import { UsersRepository } from './users/repositories/users.repository';
import { UsersQueryRepository } from './users/repositories/users.query-repository';
import { UsersService } from './users/application/users.service';
import { SessionsRepository } from './sessions/repositories/sessionsRepository';
import { AuthService } from './auth/application/auth.service';
import { DevicesService } from './devices/application/devices.service';
import { BcryptService } from './auth/adapters/bcrypt.service';
import { JwtService } from './auth/adapters/jwt.service';
import { NodemailerService } from './auth/adapters/nodemailer.service';

export const blogsRepository = new BlogsRepository();
export const blogsQueryRepository = new BlogsQueryRepository();

export const postsRepository = new PostsRepository();
export const postsQueryRepository = new PostsQueryRepository();

export const commentsQueryRepository = new CommentsQueryRepository();
export const commentsRepository = new CommentsRepository();

export const usersRepository = new UsersRepository();
export const usersQueryRepository = new UsersQueryRepository();

export const sessionsRepository = new SessionsRepository();

export const blogsService = new BlogsService(blogsRepository, postsRepository);

export const commentsService = new CommentsService(commentsRepository);

export const postsService = new PostsService(
  blogsRepository,
  postsRepository,
  commentsRepository,
  usersRepository,
);
export const deviceService = new DevicesService(sessionsRepository);

export const jwtService = new JwtService();

export const bcryptService = new BcryptService();

export const usersService = new UsersService(usersRepository, bcryptService);

export const nodemailerService = new NodemailerService();
export const authService = new AuthService(
  usersRepository,
  usersQueryRepository,
  usersService,
  sessionsRepository,
  bcryptService,
  jwtService,
  nodemailerService,
);
