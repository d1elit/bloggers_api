import { Commentator } from './commentator';

export type Comment = {
  content: string;
  commentatorInfo: Commentator;
  createdAt: string;
  postId: string;
};
