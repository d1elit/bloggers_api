import { UsersPaginatedOutput } from '../output/users-paginated.output';
import { UserDocument } from '../../../domain/userEntity';

export function mapToPostListPaginated(
  users: UserDocument[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
): UsersPaginatedOutput {
  return {
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    page: +meta.pageNumber,
    pageSize: +meta.pageSize,
    totalCount: meta.totalCount,
    items: users.map((user) => {
      return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
      };
    }),
  };
}
