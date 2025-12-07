import { injectable } from 'inversify';
import { PostLikeDocument, PostLikesModel } from '../Schemas/postLikes.schema';

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

  async create(like: PostLikeDocument) {
    console.log('IM INSIDE OF POSTLIKE');
    console.log(like);
    await like.save();
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
      status: 'Like',
    })
      .sort({ addedAt: -1 })
      .limit(5);
  }

  async findByIds(ids: string[], userId: string | undefined) {
    let likes = await PostLikesModel.find({
      postId: { $in: ids },
      userId: userId,
    });
    return likes;
  }
}
