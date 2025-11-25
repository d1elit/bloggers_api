import { RepositoryNotFoundError } from '../../core/errors/domain.errors';
import { mapToCommentViewModel } from '../router/mappers/map-to-comment-view-model';
import { CommentQueryInput } from '../router/input/comment-query.input';
import { mapToCommentListPaginated } from '../router/mappers/map-to-comment-list-paginated';
import { CommentListPaginatedOutput } from '../router/output/comment-list-paginated.output';
import { CommentOutput } from '../router/output/comment.output';
import { injectable } from 'inversify';
import { CommentModel } from '../Schemas/comment.schema';

@injectable()
export class CommentsQueryRepository {
  async findByIdOrError(id: string): Promise<CommentOutput> {
    const result = await CommentModel.findById(id);
    if (!result) {
      throw new RepositoryNotFoundError('Comment not found');
    }
    return mapToCommentViewModel(result);
  }

  async testFindAll() {
    return CommentModel.find();
  }

  async findAll(
    queryDto: CommentQueryInput,
    postId: string,
  ): Promise<CommentListPaginatedOutput> {
    const { pageNumber, pageSize, sortBy, sortDirection, content, createdAt } =
      queryDto;
    const skip = (+pageNumber - 1) * +pageSize;
    const filter: any = {};
    if (postId) {
      filter.postId = postId;
    }
    if (createdAt) {
      filter.createdAt = { $regex: createdAt, $options: 'i' };
    }
    if (content) {
      filter.content = { $regex: content, $options: 'i' };
    }
    const items = await CommentModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(+pageSize);

    const totalCount = await CommentModel.countDocuments(filter);

    return mapToCommentListPaginated(items, {
      pageNumber: pageNumber,
      pageSize: pageSize,
      totalCount,
    });
  }
}
