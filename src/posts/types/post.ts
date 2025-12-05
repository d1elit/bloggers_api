import { newestLikes, PostLike } from '../Schemas/postLikes.schema';

export type extendedLikesInfo = {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
  // newestLikes: newestLikes[];
};

export type Post = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: extendedLikesInfo;
};
