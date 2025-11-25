import { Comment } from '../types/comment';
import { RepositoryNotFoundError } from '../../core/errors/domain.errors';
import { CommentInput } from '../router/input/comment.input';
import { injectable } from 'inversify';
import { CommentDocument, CommentModel } from '../Schemas/comment.schema';

@injectable()
export class CommentsRepository {
  async create(newComment: Comment): Promise<string> {
    const comment = await CommentModel.create(newComment);
    return comment._id.toString();
  }

  async delete(commentId: string): Promise<void> {
    await CommentModel.deleteOne({ _id: commentId });
    return;
  }

  async update(id: string, dto: CommentInput) {
    await CommentModel.updateOne({ _id: id }, { $set: dto });
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
