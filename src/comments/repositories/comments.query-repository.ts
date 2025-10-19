import { commentsCollection } from '../../db/mongo.db';
import { ObjectId } from 'mongodb';
import { RepositoryNotFoundError } from '../../core/errors/repostory-not-found.error';
import { mapToCommentViewModel } from '../router/mappers/map-to-comment-view-model';
import { CommentQueryInput } from '../router/input/comment-query.input';
import { mapToCommentListPaginated } from '../router/mappers/map-to-comment-list-paginated';
import { CommentListPaginatedOutput } from '../router/output/comment-list-paginated.output';
import { CommentOutput } from '../router/output/comment.output';

export const commentsQueryRepository = {
  async findByIdOrError(id: string): Promise<CommentOutput> {
    const result = await commentsCollection.findOne({ _id: new ObjectId(id) });
    if (!result) {
      throw new RepositoryNotFoundError('Comment not found');
    }
    return mapToCommentViewModel(result._id, result);
  },

  async testFindAll() {
    return await commentsCollection.find().toArray();
  },
  async findAll(
    queryDto: CommentQueryInput,
    postId: string,
  ): Promise<CommentListPaginatedOutput> {
    const { pageNumber, pageSize, sortBy, sortDirection, content, createdAt } =
      queryDto;
    const skip = (+pageNumber - 1) * +pageSize;
    const filter: any = {};
    if (postId) {
      filter.postId = { $regex: postId, $options: 'i' };
    }
    if (createdAt) {
      filter.title = { $regex: createdAt, $options: 'i' };
    }
    if (content) {
      filter.content = { $regex: content, $options: 'i' };
    }
    const items = await commentsCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(+pageSize)
      .toArray();

    const totalCount = await commentsCollection.countDocuments(filter);

    return mapToCommentListPaginated(items, {
      pageNumber: pageNumber,
      pageSize: pageSize,
      totalCount,
    });
  },
};
