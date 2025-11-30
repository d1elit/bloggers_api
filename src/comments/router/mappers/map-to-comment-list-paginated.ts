import { WithId } from 'mongodb';
import { CommentListPaginatedOutput } from '../output/comment-list-paginated.output';
import { CommentOutput } from '../output/comment.output';
import { Comment } from '../../types/comment';
import { CommentDocument } from '../../Schemas/comment.schema';
import { container } from '../../../composition-root';
import { Like } from '../../types/Likes';
import { LikesRepository } from '../../repositories/likes.repository';
import { LikeDocument } from '../../Schemas/likes.schema';

export function mapToCommentListPaginated(
  comments: CommentDocument[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
  likes?: LikeDocument[],
): CommentListPaginatedOutput {
  return {
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    page: +meta.pageNumber,
    pageSize: +meta.pageSize,
    totalCount: meta.totalCount,

    items: comments.map((comment, index) => {
      const like = likes[index]; // 👈 ВАЖНО

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
          myStatus: like?.myStatus ?? 'None', // 👈 ВОТ ТУТ ПРИСВАИВАЕШЬ
        },
      };
    }),
  };
}
