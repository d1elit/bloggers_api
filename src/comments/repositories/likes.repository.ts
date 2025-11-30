import { injectable } from 'inversify';
import { BlogModel } from '../../blogs/Schemas/blog.schema';
import { RepositoryNotFoundError } from '../../core/errors/domain.errors';
import { LikeDocument, LikesModel } from '../Schemas/likes.schema';

@injectable()
export class LikesRepository {
  async find(userId: string, commentId: string): Promise<LikeDocument | null> {
    console.log('IN FIND ID: ' + userId, 'COMMENT ID: ' + commentId);
    let like = await LikesModel.findOne({
      userId: userId,
      commentId: commentId,
    });

    if (!like) return null;
    return like;
  }

  async create(like: LikeDocument) {
    await like.save();
    return;
  }
  async update(like: LikeDocument) {
    await like.save();
    return;
  }
}
