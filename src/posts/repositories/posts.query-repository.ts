import { PostQueryInput } from '../router/input/post-query.input';
import { RepositoryNotFoundError } from '../../core/errors/domain.errors';
import { mapToPostListPaginated } from '../router/mappers/map-to-post-list-paginated';
import { postListPaginatedOutput } from '../router/output/post-list-paginated.output';
import { injectable } from 'inversify';
import { PostDocument, PostModel } from '../Schemas/post.schema';

@injectable()
export class PostsQueryRepository {
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
    const items = await PostModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(+pageSize);

    const totalCount = await PostModel.countDocuments(filter);

    return mapToPostListPaginated(items, {
      pageNumber: pageNumber,
      pageSize: pageSize,
      totalCount,
    });
  }

  async findByIdOrError(id: string): Promise<PostDocument> {
    const res = await PostModel.findById(id);
    if (!res) {
      throw new RepositoryNotFoundError('Post not found');
    }
    return res;
  }
}
