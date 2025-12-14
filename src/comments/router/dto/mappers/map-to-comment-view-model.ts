import { CommentOutput } from '../output/comment.output';
import { CommentDocument } from '../../../domain/commentEntity';

export function mapToCommentViewModel(
  comment: CommentDocument,
  likeStatus?: string,
): CommentOutput {
  console.log(likeStatus);
  return {
    id: comment._id.toString(),
    content: comment.content,
    commentatorInfo: {
      userLogin: comment.commentatorInfo.userLogin,
      userId: comment.commentatorInfo.userId,
    },
    likesInfo: {
      likesCount: comment.likesInfo.likesCount || 0,
      dislikesCount: comment.likesInfo.dislikesCount || 0,
      myStatus: likeStatus || 'None',
    },

    createdAt: comment.createdAt,
  };
}
