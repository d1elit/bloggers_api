import { PaginationAndSorting } from '../../../../core/types/pagination-and-sorting';
import { UserSortFields } from '../../../domain/types/UserSortFields';

export type UsersQueryInput = PaginationAndSorting<UserSortFields> &
  Partial<{
    searchLoginTerm: string;
    searchEmailTerm: string;
  }>;
