import { PostQueryInput } from '../router/input/post-query.input';
import { ObjectId, WithId } from 'mongodb';
import { Post } from '../types/post';
import { postsCollection } from '../../db/mongo.db';
import { RepositoryNotFoundError } from '../../core/errors/domain.errors';
import { mapToPostListPaginated } from '../router/mappers/map-to-post-list-paginated';
import { postListPaginatedOutput } from '../router/output/post-list-paginated.output';

export const postsQueryRepository = {
  async findAll(
    queryDto: PostQueryInput,
    blogId?: string,
  ): Promise<postListPaginatedOutput> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      title,
      shortDescription,
      content,
      blogName,
    } = queryDto;
    const skip = (+pageNumber - 1) * +pageSize;
    const filter: any = {};
    if (blogId) {
      filter.blogId = { $regex: blogId, $options: 'i' };
    }
    if (title) {
      filter.title = { $regex: title, $options: 'i' };
    }
    if (shortDescription) {
      filter.shortDescription = { $regex: shortDescription, $options: 'i' };
    }
    if (content) {
      filter.content = { $regex: content, $options: 'i' };
    }
    if (blogName) {
      filter.blogName = { $regex: blogName, $options: 'i' };
    }
    const items = await postsCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(+pageSize)
      .toArray();

    const totalCount = await postsCollection.countDocuments(filter);

    return mapToPostListPaginated(items, {
      pageNumber: pageNumber,
      pageSize: pageSize,
      totalCount,
    });
  },
  async findByIdOrError(id: string): Promise<WithId<Post>> {
    const res = await postsCollection.findOne({ _id: new ObjectId(id) });
    if (!res) {
      throw new RepositoryNotFoundError('Post not found');
    }
    return res;
  },
};
