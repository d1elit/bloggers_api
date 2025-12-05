import { HydratedDocument, model, Model } from 'mongoose';
import { Post } from '../types/post';
import mongoose from 'mongoose';

type PostModel = Model<Post>;

export type PostDocument = HydratedDocument<Post>;

export const PostSchema = new mongoose.Schema<Post>({
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  content: { type: String, required: true },
  blogId: { type: String, required: true },
  blogName: { type: String, required: true },
  createdAt: { type: String, required: true },
  extendedLikesInfo: {
    likesCount: { type: Number, default: 0 },
    dislikesCount: { type: Number, default: 0 },
    myStatus: { type: String, default: 'None' },
    // newestLikes: [
    //   {
    //     addedAt: { type: Date, required: true },
    //     userId: { type: String, required: true },
    //     login: { type: String, required: true },
    //   },
    // ],
  },
});

export const PostModel = model<Post, PostModel>('posts', PostSchema);
