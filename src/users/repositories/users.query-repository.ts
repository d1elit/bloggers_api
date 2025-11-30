import { UsersQueryInput } from '../router/input/user-query.input';
import { mapToPostListPaginated } from '../router/mappers/map-to-list-paginated';
import { UsersPaginatedOutput } from '../router/output/users-paginated.output';

import { RepositoryNotFoundError } from '../../core/errors/domain.errors';
import { injectable } from 'inversify';
import { UserDocument, UserModel } from '../Schemas/user.schema';

@injectable()
export class UsersQueryRepository {
  async findAll(queryDto: UsersQueryInput): Promise<UsersPaginatedOutput> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchLoginTerm,
      searchEmailTerm,
    } = queryDto;

    const skip = (+pageNumber - 1) * +pageSize;
    const filter: any = {};

    if (searchLoginTerm || searchEmailTerm) {
      const orFilter: any[] = [];
      if (searchLoginTerm)
        orFilter.push({ login: { $regex: searchLoginTerm, $options: 'i' } });
      if (searchEmailTerm)
        orFilter.push({ email: { $regex: searchEmailTerm, $options: 'i' } });
      filter.$or = orFilter;
    }
    const users = await UserModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(+pageSize);

    const totalCount = await UserModel.countDocuments(filter);
    console.log(`totalCount ${totalCount} users`);
    return mapToPostListPaginated(users, { pageNumber, pageSize, totalCount });
  }

  async findByIdOrError(id: string): Promise<UserDocument | null> {
    let user = UserModel.findById(id);
    if (!user) {
      throw new RepositoryNotFoundError('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return UserModel.findOne({ email: email });
  }
}
