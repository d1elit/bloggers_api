import { injectable } from 'inversify';
import {
  PostLikeDocument,
  PostLikeEntity,
  PostLikesModel,
} from '../../domain/postLikeEntity';

@injectable()
export class PostLikesRepository {
  async find(
    userId: string | undefined,
    postId: string,
  ): Promise<PostLikeDocument | null> {
    let like = await PostLikesModel.findOne({
      userId: userId,
      postId: postId,
    });

    if (!like) return null;
    return like;
  }

  async create(like: PostLikeEntity) {
    await PostLikesModel.create(like);
    return;
  }
  async update(like: PostLikeDocument) {
    await like.save();
    return;
  }

  async findLastLikes(postId: string): Promise<PostLikeDocument[] | null> {
    console.log(postId);
    return PostLikesModel.find({
      postId: postId,
      myStatus: 'Like',
    })
      .sort({ addedAt: -1 })
      .limit(3);
  }

  async findByIds(ids: string[], userId: string | undefined) {
    return PostLikesModel.find({
      postId: { $in: ids },
      userId: userId,
    });
  }
}
