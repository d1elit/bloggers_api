import { HydratedDocument, model, Model } from 'mongoose';
import mongoose from 'mongoose';
import { LikesInfoSchema } from './commentLikeEntity';
import { Commentator } from './types/commentator';
import { LikesInfo } from './types/LikesInfo';
import { CommentInput } from '../router/dto/input/comment.input';

export type CommentDto = {
  content: string;
  postId: string;
  commentatorInfo: Commentator;
};

export const CommentSchema = new mongoose.Schema<CommentEntity>({
  content: { type: String, required: true },
  commentatorInfo: {
    userId: { type: String, required: true },
    userLogin: { type: String, required: true },
  },
  createdAt: { type: String, required: true },
  likesInfo: { type: LikesInfoSchema },
  postId: { type: String, required: true },
});

export class CommentEntity {
  content!: string;
  commentatorInfo!: Commentator;
  createdAt!: string;
  postId!: string;
  likesInfo!: LikesInfo;

  static createNew(commentDto: CommentDto) {
    const comment = new CommentEntity();
    comment.content = commentDto.content;
    comment.postId = commentDto.postId;
    comment.commentatorInfo = commentDto.commentatorInfo;
    comment.createdAt = new Date().toISOString();
    comment.likesInfo = {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: 'none',
    };
    return comment;
  }

  update(commentDto: CommentInput) {
    this.content = commentDto.content;
  }

  updateLikeCount(newStatus: string, oldStatus?: string): void {
    if (oldStatus === 'Like') this.likesInfo.likesCount -= 1;
    if (oldStatus === 'Dislike') this.likesInfo.dislikesCount -= 1;

    if (newStatus === 'Like') this.likesInfo.likesCount += 1;
    if (newStatus === 'Dislike') this.likesInfo.dislikesCount += 1;
  }
}

type CommentModel = Model<CommentEntity>;

export type CommentDocument = HydratedDocument<CommentEntity>;
CommentSchema.loadClass(CommentEntity);

export const CommentModel = model<CommentEntity, CommentModel>(
  'comments',
  CommentSchema,
);
