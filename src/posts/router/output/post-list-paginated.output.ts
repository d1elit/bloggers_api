import { PostOutput } from './post.output';

export type postListPaginatedOutput = {
  page: number;
  pageSize: number;
  pagesCount: number;
  totalCount: number;
  items: PostOutput[];
};
