import express, { Express } from 'express';
import { testingRouter } from './testing/routers/testing.router';
import { BLOGS_PATH, POSTS_PATH, TESTING_PATH } from './core/path';
import { blogsRouter } from './blogs/router/blogs.router';
import { postsRouter } from './posts/router/posts.router';

export const setupApp = (app: Express) => {
  app.use(express.json()); // middleware для парсинга JSON в теле запроса

  // основной роут
  app.get('/', (req, res) => {
    res.status(200).send('bloggers api fr');
  });
  app.use(POSTS_PATH, postsRouter);
  app.use(BLOGS_PATH, blogsRouter);
  app.use(TESTING_PATH, testingRouter);

  return app;
};
