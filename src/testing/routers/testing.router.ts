import { Request, Response, Router } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { BlogModel } from '../../blogs/domain/blogEntity';
import { PostModel } from '../../posts/domain/postEntity';
import { UserModel } from '../../users/domain/userEntity';
import { CommentModel } from '../../comments/domain/commentEntity';
import { SessionModel } from '../../sessions/Schemas/sessionSchema';
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
