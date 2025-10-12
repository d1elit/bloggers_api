import { postsCollection, usersCollection } from '../../db/mongo.db';
import { UsersQueryInput } from '../router/input/user-query.input';
import { mapToPostListPaginated } from '../router/mappers/map-to-list-paginated';
import { UsersPaginatedOutput } from '../router/output/users-paginated.output';

export const usersQueryRepository = {
  async findAll(queryDto: UsersQueryInput): Promise<UsersPaginatedOutput> {
    const { pageNumber, pageSize, sortBy, sortDirection, login, email } =
      queryDto;

    const skip = (+pageNumber - 1) * +pageSize;
    const filter: any = {};
    if (login) {
      filter.login = { $regex: login, $options: 'i' };
    }
    if (email) {
      filter.email = { $regex: email, $options: 'i' };
    }

    const users = await usersCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await postsCollection.countDocuments(filter);
    return mapToPostListPaginated(users, { pageNumber, pageSize, totalCount });
  },
};
