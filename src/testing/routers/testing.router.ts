import { Request, Response, Router } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { BlogModel } from '../../blogs/Entity/blogSchema';
import { PostModel } from '../../posts/Schemas/post.schema';
import { UserModel } from '../../users/Schemas/user.schema';
import { CommentModel } from '../../comments/Schemas/comment.schema';
import { SessionModel } from '../../sessions/Schemas/session.schema';
import { RevokedTokenModel } from '../../auth/Schemas/revoked-token.schema';

export const testingRouter = Router({});

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
  await Promise.all([
    BlogModel.deleteMany({}),
    PostModel.deleteMany({}),
    UserModel.deleteMany({}),
    CommentModel.deleteMany({}),
    SessionModel.deleteMany({}),
    RevokedTokenModel.deleteMany({}),
  ]);
  res.sendStatus(HttpStatus.NoContent);
});
