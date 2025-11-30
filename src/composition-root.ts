import 'reflect-metadata';
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

import { Container } from 'inversify';
import { BlogsController } from './blogs/router/blogs.controller';
import { AuthController } from './auth/router/auth.controller';
import { CommentsController } from './comments/router/comments.controller';
import { PostsController } from './posts/router/posts.controller';
import { UsersController } from './users/router/users.controller';
import { DevicesController } from './devices/router/devices.controller';
import { LikesRepository } from './comments/repositories/likes.repository';

export const container = new Container();
container.bind<BlogsRepository>(BlogsRepository).toSelf();
container.bind<BlogsQueryRepository>(BlogsQueryRepository).toSelf();
container.bind<PostsRepository>(PostsRepository).toSelf();
container.bind<PostsQueryRepository>(PostsQueryRepository).toSelf();
container.bind<CommentsRepository>(CommentsRepository).toSelf();
container.bind<CommentsQueryRepository>(CommentsQueryRepository).toSelf();
container.bind<UsersRepository>(UsersRepository).toSelf();
container.bind<UsersQueryRepository>(UsersQueryRepository).toSelf();
container.bind<SessionsRepository>(SessionsRepository).toSelf();
container.bind<LikesRepository>(LikesRepository).toSelf();

container.bind<CommentsService>(CommentsService).toSelf();
container.bind<AuthService>(AuthService).toSelf();
container.bind<BcryptService>(BcryptService).toSelf();
container.bind<JwtService>(JwtService).toSelf();
container.bind<UsersService>(UsersService).toSelf();
container.bind<DevicesService>(DevicesService).toSelf();
container.bind<PostsService>(PostsService).toSelf();
container.bind<BlogsService>(BlogsService).toSelf();
container.bind<NodemailerService>(NodemailerService).toSelf();
container.bind<BlogsController>(BlogsController).toSelf();
container.bind<AuthController>(AuthController).toSelf();
container.bind<CommentsController>(CommentsController).toSelf();
container.bind<PostsController>(PostsController).toSelf();
container.bind<UsersController>(UsersController).toSelf();
container.bind<DevicesController>(DevicesController).toSelf();

// export const usersQueryRepository = new UsersQueryRepository();
// // export const blogsQueryRepository = new BlogsQueryRepository();
// export const postsQueryRepository = new PostsQueryRepository();
// export const commentsQueryRepository = new CommentsQueryRepository();
//
// // export const blogsService = container.get(BlogsService);
// export const commentsService = container.get(CommentsService);
// export const postsService = container.get(PostsService);
// export const deviceService = container.get(DevicesService);
//
// export const jwtService = container.get(JwtService);
//
// export const usersService = container.get(UsersService);
//
// // export const authService = container.get(AuthService);
