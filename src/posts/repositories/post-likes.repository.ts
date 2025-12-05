import { injectable } from 'inversify';
import { PostLikeDocument, PostLikesModel } from '../Schemas/postLikes.schema';
import { LikesModel } from '../../comments/Schemas/likes.schema';

@injectable()
export class PostLikesRepository {
  async find(
    userId: string | undefined,
    postId: string,
  ): Promise<PostLikeDocument | null> {
    console.log('IN FIND ID: ' + userId, 'COMMENT ID: ' + postId);
    let like = await PostLikesModel.findOne({
      userId: userId,
      postId: postId,
    });

    if (!like) return null;
    return like;
  }

  async create(like: PostLikeDocument) {
    console.log('IM INSIDE OF POSTLIKE ');
    console.log(like);
    await like.save();
    return;
  }
  async update(like: PostLikeDocument) {
    await like.save();
    return;
  }
}
