import { RepositoryNotFoundError } from '../../../core/errors/domain.errors';
import { BlogQueryInput } from '../../router/dto/input/blog-query.input';
import { mapToBlogViewModel } from '../../router/dto/mappers/map-to-blog-list-paginated.util';
import { BlogListPaginatedOutput } from '../../router/dto/output/blog-list-paginated.output';
import { injectable } from 'inversify';
import { BlogDocument, BlogModel } from '../../domain/blogEntity';
import { mapToBlogView } from '../../router/dto/mappers/map-to-blog-view-model';
import { BlogOutput } from '../../router/dto/output/blog.output';

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
