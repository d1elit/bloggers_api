import mongoose, { HydratedDocument, model, Model } from 'mongoose';
import { Like } from '../types/Likes';

type LikesModel = Model<Like>;

export type LikeDocument = HydratedDocument<Like>;

export const LikesInfoSchema = new mongoose.Schema({
  likesCount: { type: Number, required: true },
  dislikesCount: { type: Number, required: true },
});

export const LikesSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  commentId: { type: String, required: true },
  myStatus: {
    type: String,
    required: true,
    enum: ['Like', 'Dislike', 'None'],
  },
});

export const LikesModel = model<Like, LikesModel>('likes', LikesSchema);
