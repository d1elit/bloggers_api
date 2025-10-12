import express, { Express } from 'express';
import { testingRouter } from './testing/routers/testing.router';
import {AUTH_PATH, BLOGS_PATH, POSTS_PATH, TESTING_PATH, USERS_PATH} from './core/path';
import { blogsRouter } from './blogs/router/blogs.router';
import { postsRouter } from './posts/router/posts.router';
import {authRouter} from "./auth/router/auth.router";
import {usersRouter} from "./users/router/users.router";

export const setupApp = (app: Express) => {
  app.use(express.json()); // middleware для парсинга JSON в теле запроса

  // основной роут
  app.get('/', (req, res) => {
    res.status(200).send('bloggers api 05');
  });
  app.use(POSTS_PATH, postsRouter);
  app.use(BLOGS_PATH, blogsRouter);
  app.use(TESTING_PATH, testingRouter);
  app.use(AUTH_PATH, authRouter);
  app.use(USERS_PATH, usersRouter);

  return app;
};
