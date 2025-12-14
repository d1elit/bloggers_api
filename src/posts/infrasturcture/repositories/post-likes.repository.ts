import { injectable } from 'inversify';
import { PostLikeDocument, PostLikesModel } from '../../domain/postLikeEntity';

@injectable()
export class PostLikesRepository {
  async find(
    userId: string | undefined,
    postId: string,
  ): Promise<PostLikeDocument | null> {
    console.log('IM INSIDE OF POSTLIke FIND METHOD');
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
