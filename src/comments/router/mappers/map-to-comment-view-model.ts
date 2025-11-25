import { ObjectId } from 'mongodb';
import { Comment } from '../../types/comment';
import { CommentOutput } from '../output/comment.output';
import { CommentDocument } from '../../Schemas/comment.schema';

export function mapToCommentViewModel(comment: CommentDocument): CommentOutput {
  return {
    id: comment._id.toString(),
    content: comment.content,
    commentatorInfo: {
      userLogin: comment.commentatorInfo.userLogin,
      userId: comment.commentatorInfo.userId,
    },
    createdAt: comment.createdAt,
  };
}
