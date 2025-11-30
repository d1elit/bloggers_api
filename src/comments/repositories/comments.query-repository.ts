import { RepositoryNotFoundError } from '../../core/errors/domain.errors';
import { mapToCommentViewModel } from '../router/mappers/map-to-comment-view-model';
import { CommentQueryInput } from '../router/input/comment-query.input';
import { mapToCommentListPaginated } from '../router/mappers/map-to-comment-list-paginated';
import { CommentListPaginatedOutput } from '../router/output/comment-list-paginated.output';
import { CommentOutput } from '../router/output/comment.output';
import { injectable } from 'inversify';
import { CommentModel } from '../Schemas/comment.schema';
import { container } from '../../composition-root';
import { LikesRepository } from './likes.repository';

@injectable()
export class CommentsQueryRepository {
  async findByIdOrError(
    id: string,
    likeStatus?: string | undefined,
  ): Promise<CommentOutput> {
    const result = await CommentModel.findById(id);
    if (!result) {
      throw new RepositoryNotFoundError('Comment not found');
    }
    return mapToCommentViewModel(result, likeStatus);
  }

  async testFindAll() {
    return CommentModel.find();
  }

  async findAll(
    queryDto: CommentQueryInput,
    postId: string,
    userId?: string,
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

    const likesRepository = container.get(LikesRepository);

    const likes = await Promise.all(
      items.map((c) => likesRepository.find(userId, c._id.toString())),
    );
    console.log(likes);

    const totalCount = await CommentModel.countDocuments(filter);

    return mapToCommentListPaginated(
      items,
      {
        pageNumber: pageNumber,
        pageSize: pageSize,
        totalCount,
      },
      // @ts-ignore
      likes,
    );
  }
}
