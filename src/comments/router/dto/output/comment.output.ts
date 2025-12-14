import { Commentator } from '../../../domain/types/commentator';

export type CommentOutput = {
  id: string;
  content: string;
  commentatorInfo: Commentator;
  createdAt: string;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
  };
};
