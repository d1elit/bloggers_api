import { Request, Response, Router } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import {
  blogsCollection,
  commentsCollection,
  postsCollection,
  sessionsCollection,
  usersCollection,
} from '../../db/mongo.db';

export const testingRouter = Router({});

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
  await Promise.all([
    blogsCollection.deleteMany(),
    postsCollection.deleteMany(),
    usersCollection.deleteMany(),
    commentsCollection.deleteMany(),
    sessionsCollection.deleteMany(),
  ]);
  res.sendStatus(HttpStatus.NoContent);
});
