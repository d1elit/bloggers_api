import { PaginationAndSorting } from '../../../../core/types/pagination-and-sorting';
import { CommentsSortField } from '../../../domain/types/commentsSortField';

export type CommentQueryInput = PaginationAndSorting<CommentsSortField> &
  Partial<{
    content: string;
    createdAt: string;
    postId: string;
  }>;
