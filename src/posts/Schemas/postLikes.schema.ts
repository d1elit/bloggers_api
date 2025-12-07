import mongoose, { HydratedDocument, model, Model } from 'mongoose';

export type newestLikes = {
  addedAt: string;
  userId: string;
  login: string;
};

export type PostLike = {
  userId: string;
  postId: string;
  myStatus: string;
  userLogin: string;
  addedAt: string;

  // newestLikes: newestLikes[];
};

type PostLikesModel = Model<PostLike>;

export type PostLikeDocument = HydratedDocument<PostLike>;

export const PostLikesInfoSchema = new mongoose.Schema({
  likesCount: { type: Number, required: true },
  dislikesCount: { type: Number, required: true },
});

export const PostLikesSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  postId: { type: String, required: true },
  userLogin: { type: String, required: true },
  addedAt: { type: Date, default: Date.now },
  myStatus: {
    type: String,
    required: true,
    enum: ['Like', 'Dislike', 'None'],
    // newestLikes: [
    //   {
    //     addedAt: { type: Date, default: Date.now },
    //     userId: { type: String, required: true },
    //     login: { type: String, required: true },
    //   },
    // ],
  },
});

export const PostLikesModel = model<PostLike, PostLikesModel>(
  'post-likes',
  PostLikesSchema,
);
