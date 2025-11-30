import { RepositoryNotFoundError } from '../../core/errors/domain.errors';
import { BlogQueryInput } from '../router/input/blog-query.input';
import { mapToBlogViewModel } from '../router/mappers/map-to-blog-list-paginated.util';
import { BlogListPaginatedOutput } from '../router/output/blog-list-paginated.output';
import { injectable } from 'inversify';
import { BlogDocument, BlogModel } from '../Schemas/blog.schema';
import { mapToBlogView } from '../router/mappers/map-to-blog-view-model';
import { BlogOutput } from '../router/output/blog.output';

@injectable()
export class BlogsQueryRepository {
  async findAll(queryDto: BlogQueryInput): Promise<BlogListPaginatedOutput> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchNameTerm,
      searchDescriptionTerm,
    } = queryDto;
    const skip = (+pageNumber - 1) * +pageSize;
    const filter: any = {};
    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: 'i' };
    }
    if (searchDescriptionTerm) {
      filter.description = { $regex: searchDescriptionTerm, $options: 'i' };
    }

    const items = await BlogModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(+pageSize);

    const totalCount = await BlogModel.countDocuments(filter);

    return mapToBlogViewModel(items, {
      pageNumber: pageNumber,
      pageSize: pageSize,
      totalCount,
    });
  }

  async findByIdOrError(id: string): Promise<BlogDocument> {
    const res = await BlogModel.findById(id);
    if (!res) {
      throw new RepositoryNotFoundError('blog not exist');
    }

    return res;
  }
  async findMappedOrError(id: string): Promise<BlogOutput> {
    const res = await BlogModel.findById(id);
    if (!res) {
      throw new RepositoryNotFoundError('blog not exist');
    }
    return mapToBlogView(res);
  }
}
