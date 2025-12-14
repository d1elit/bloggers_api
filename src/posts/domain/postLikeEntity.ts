import mongoose, { HydratedDocument, model, Model } from 'mongoose';

export const PostLikesSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  postId: { type: String, required: true },
  userLogin: { type: String, required: true },
  addedAt: { type: Date, default: Date.now },
  myStatus: {
    type: String,
    required: true,
    enum: ['Like', 'Dislike', 'None'],
  },
});

export type likeDto = {
  userId: string;
  postId: string;
  userLogin: string;
  likeStatus: string;
};

export class PostLikeEntity {
  userId!: string;
  postId!: string;
  userLogin!: string;
  myStatus!: string;
  addedAt!: string;

  static createNew(likeDto: likeDto) {
    let like = new PostLikeEntity();
    like.userId = likeDto.userId;
    like.postId = likeDto.postId;
    like.addedAt = new Date().toISOString();
    like.userLogin = likeDto.userLogin;
    like.myStatus = likeDto.likeStatus;
    return like;
  }

  updateLikeStatus(likeStatus: string) {
    this.myStatus = likeStatus;
  }
}

type PostLikesModel = Model<PostLikeEntity>;

export type PostLikeDocument = HydratedDocument<PostLikeEntity>;

PostLikesSchema.loadClass(PostLikeEntity);

export const PostLikesModel = model<PostLikeEntity, PostLikesModel>(
  'post-likes',
  PostLikesSchema,
);
