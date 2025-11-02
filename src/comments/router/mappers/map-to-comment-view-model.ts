import { ObjectId } from 'mongodb';
import { Comment } from '../../types/comment';
import { CommentOutput } from '../output/comment.output';

export function mapToCommentViewModel(
  id: ObjectId,
  comment: Comment,
): CommentOutput {
  return {
    id: id.toString(),
    content: comment.content,
    commentatorInfo: {
      userLogin: comment.commentatorInfo.userLogin,
      userId: comment.commentatorInfo.userId,
    },
    createdAt: comment.createdAt,
  };
}
