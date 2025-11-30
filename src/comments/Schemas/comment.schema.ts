import { HydratedDocument, model, Model } from 'mongoose';
import { Comment } from '../types/comment';
import mongoose from 'mongoose';
import { LikesInfoSchema } from './likes.schema';

type CommentModel = Model<Comment>;

export type CommentDocument = HydratedDocument<Comment>;

export const CommentSchema = new mongoose.Schema<Comment>({
  content: { type: String, required: true },
  commentatorInfo: {
    userId: { type: String, required: true },
    userLogin: { type: String, required: true },
  },
  createdAt: { type: String, required: true },
  likesInfo: { type: LikesInfoSchema },
  postId: { type: String, required: true },
});

export const CommentModel = model<Comment, CommentModel>(
  'comments',
  CommentSchema,
);
