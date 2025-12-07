import { ExtendedLikesInfoSchema } from '../Schemas/post.schema';

export type Post = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: ExtendedLikesInfoSchema;
};
