import { RepositoryNotFoundError } from '../../../core/errors/domain.errors';
import { CommentInput } from '../../router/dto/input/comment.input';
import { injectable } from 'inversify';
import {
  CommentDocument,
  CommentEntity,
  CommentModel,
} from '../../domain/commentEntity';

@injectable()
export class CommentsRepository {
  async create(newComment: CommentEntity): Promise<string> {
    const createdComment = await CommentModel.create(newComment);
    return createdComment._id.toString();
  }

  async delete(commentId: string): Promise<void> {
    await CommentModel.deleteOne({ _id: commentId });
    return;
  }

  async update(id: string, dto: CommentInput) {
    await CommentModel.updateOne({ _id: id }, { $set: dto });
    return;
  }
  async save(comment: CommentDocument) {
    await comment.save();
    return;
  }

  async findByIdOrError(id: string): Promise<CommentDocument> {
    const result = await CommentModel.findById(id);
    if (!result) {
      throw new RepositoryNotFoundError('Comment not found');
    }
    return result;
  }
}
