import { HydratedDocument, model, Model } from 'mongoose';
import { Post } from '../types/post';
import mongoose from 'mongoose';

type PostModel = Model<Post>;

export type PostDocument = HydratedDocument<Post>;

type NewestLike = {
  addedAt: string;
  userId: string;
  login: string;
};

type ExtendedLikesInfoSchema = {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
  newestLikes: NewestLike[];
};

const NewestLikeSchema = new mongoose.Schema<NewestLike>(
  {
    addedAt: { type: String, required: true },
    userId: { type: String, required: true },
    login: { type: String, required: true },
  },
  { _id: false }, // <-- важно, чтобы не создавался _id
);

const ExtendedLikesInfoSchema = new mongoose.Schema<ExtendedLikesInfoSchema>(
  {
    likesCount: { type: Number, default: 0 },
    dislikesCount: { type: Number, default: 0 },
    myStatus: { type: String, default: 'None' },
    newestLikes: {
      type: [NewestLikeSchema],
      default: [],
    },
  },
  { _id: false },
);

export const PostSchema = new mongoose.Schema<Post>({
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  content: { type: String, required: true },
  blogId: { type: String, required: true },
  blogName: { type: String, required: true },
  createdAt: { type: String, required: true },
  extendedLikesInfo: {
    type: ExtendedLikesInfoSchema,
    default: () => ({}), // <-- важно, иначе будет undefined
  },
});

export const PostModel = model<Post, PostModel>('posts', PostSchema);
