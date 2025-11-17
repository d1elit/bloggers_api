import { CommentInput } from '../router/input/comment.input';
import { CommentsRepository } from '../repositories/comments.repository';
import { AccessError } from '../../core/errors/domain.errors';

export class CommentsService {
  constructor(public readonly commentsRepository: CommentsRepository) {}

  async delete(commentId: string, userId: string): Promise<void> {
    await this.commentsRepository.findByIdOrError(commentId);
    await this.isUserOwner(commentId, userId);
    return await this.commentsRepository.delete(commentId);
  }

  async update(commentId: string, userId: string, commentDto: CommentInput) {
    await this.commentsRepository.findByIdOrError(commentId);
    await this.isUserOwner(commentId, userId);
    await this.commentsRepository.update(commentId, commentDto);
    return;
  }

  async isUserOwner(commentId: string, userID: string) {
    let comment = await this.commentsRepository.findByIdOrError(commentId);
    if (comment.commentatorInfo.userId !== userID) {
      throw new AccessError('Access denied');
    }
    return;
  }
}
