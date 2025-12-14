import { Commentator } from './commentator';
import { LikesInfo } from './LikesInfo';

export type Comment = {
  content: string;
  commentatorInfo: Commentator;
  createdAt: string;
  postId: string;
  likesInfo: LikesInfo;
};
