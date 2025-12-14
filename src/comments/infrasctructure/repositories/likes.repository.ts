import { injectable } from 'inversify';
import { LikeDocument, CommentLikeModel } from '../../domain/commentLikeEntity';

@injectable()
export class LikesRepository {
  async find(
    userId: string | undefined,
    commentId: string,
  ): Promise<LikeDocument | null> {
    console.log('IN FIND ID: ' + userId, 'COMMENT ID: ' + commentId);
    let like = await CommentLikeModel.findOne({
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
  async findByAllId(ids: string[], userId: string | undefined) {
    let likes = await CommentLikeModel.find({
      commentId: { $in: ids },
      userId: userId,
    });
    return likes;
  }
}
