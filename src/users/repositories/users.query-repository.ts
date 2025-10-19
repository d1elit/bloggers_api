import { usersCollection } from '../../db/mongo.db';
import { UsersQueryInput } from '../router/input/user-query.input';
import { mapToPostListPaginated } from '../router/mappers/map-to-list-paginated';
import { UsersPaginatedOutput } from '../router/output/users-paginated.output';

import { ObjectId, WithId } from 'mongodb';
import { User } from '../types/user';
import { RepositoryNotFoundError } from '../../core/errors/repostory-not-found.error';

export const usersQueryRepository = {
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
    const users = await usersCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(+pageSize)
      .toArray();

    const totalCount = await usersCollection.countDocuments(filter);
    console.log(`totalCount ${totalCount} users`);
    return mapToPostListPaginated(users, { pageNumber, pageSize, totalCount });
  },

  async findByIdOrError(id: string): Promise<WithId<User> | null> {
    let user = usersCollection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      throw new RepositoryNotFoundError('User not found');
    }
    return user;
  },
};
