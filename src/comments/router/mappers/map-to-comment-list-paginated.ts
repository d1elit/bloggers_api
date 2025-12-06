import { CommentListPaginatedOutput } from '../output/comment-list-paginated.output';

import { CommentDocument } from '../../Schemas/comment.schema';

import { LikeDocument } from '../../Schemas/likes.schema';

export function mapToCommentListPaginated(
  comments: CommentDocument[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
  likes?: LikeDocument[] | undefined,
): CommentListPaginatedOutput {
  return {
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    page: +meta.pageNumber,
    pageSize: +meta.pageSize,
    totalCount: meta.totalCount,

    items: comments.map((comment) => {
      let like = likes?.find((l) => l.commentId === comment._id.toString());

      return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
          userLogin: comment.commentatorInfo.userLogin,
          userId: comment.commentatorInfo.userId,
        },
        createdAt: comment.createdAt,
        likesInfo: {
          likesCount: comment.likesInfo.likesCount,
          dislikesCount: comment.likesInfo.dislikesCount,
          myStatus: like?.myStatus ?? 'None',
        },
      };
    }),
  };
}
