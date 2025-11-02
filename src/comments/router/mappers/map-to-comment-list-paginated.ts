import { WithId } from 'mongodb';
import { CommentListPaginatedOutput } from '../output/comment-list-paginated.output';
import { CommentOutput } from '../output/comment.output';
import { Comment } from '../../types/comment';

export function mapToCommentListPaginated(
  comments: WithId<Comment>[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
): CommentListPaginatedOutput {
  return {
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    page: +meta.pageNumber,
    pageSize: +meta.pageSize,
    totalCount: meta.totalCount,

    items: comments.map(
      (comment): CommentOutput => ({
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
          userLogin: comment.commentatorInfo.userLogin,
          userId: comment.commentatorInfo.userId,
        },
        createdAt: comment.createdAt,
      }),
    ),
  };
}
