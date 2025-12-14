import mongoose, { HydratedDocument, model, Model } from 'mongoose';

export const LikesInfoSchema = new mongoose.Schema({
  likesCount: { type: Number, required: true },
  dislikesCount: { type: Number, required: true },
});

export const CommentLikeScheme = new mongoose.Schema({
  userId: { type: String, required: true },
  commentId: { type: String, required: true },
  myStatus: {
    type: String,
    required: true,
    enum: ['Like', 'Dislike', 'None'],
  },
});

export type CommentLikeDto = {
  userId: string;
  commentId: string;
  myStatus: string;
};

export class CommentLikeEntity {
  userId!: string;
  commentId!: string;
  myStatus!: string;

  static createNew(commentLikeDto: CommentLikeDto) {
    const commentLike = new CommentLikeEntity();
    commentLike.userId = commentLikeDto.userId;
    commentLike.commentId = commentLikeDto.commentId;
    commentLike.myStatus = commentLikeDto.myStatus;
    return commentLike;
  }
}

type LikesModel = Model<CommentLikeEntity>;

export type LikeDocument = HydratedDocument<CommentLikeEntity>;

export const CommentLikeModel = model<CommentLikeEntity, LikesModel>(
  'likes',
  CommentLikeScheme,
);
