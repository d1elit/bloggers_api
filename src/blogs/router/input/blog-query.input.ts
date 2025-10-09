import { blogsSortFields } from '../../types/blogsSortFields';
import { PaginationAndSorting } from '../../../core/types/pagination-and-sorting';

export type BlogQueryInput = PaginationAndSorting<blogsSortFields> &
  Partial<{
    createdAt: string;
    searchNameTerm: string;
    searchDescriptionTerm: string;
    websiteUri: string;
  }>;
