import { CommentInput } from '../router/input/comment.input';
import { commentsRepository } from '../repositories/comments.repository';
import { AccessError } from '../../core/errors/domain.errors';

export const commentsService = {
  async delete(commentId: string, userId: string): Promise<void> {
    await this.isUserOwner(commentId, userId);
    return await commentsRepository.delete(commentId);
  },
  async update(commentId: string, userId: string, commentDto: CommentInput) {
    await this.isUserOwner(commentId, userId);
    await commentsRepository.update(commentId, commentDto);
    return;
  },
  async isUserOwner(commentId: string, userID: string) {
    let comment = await commentsRepository.findByIdOrError(commentId);
    if (comment.commentatorInfo.userId !== userID) {
      throw new AccessError('Access denied');
    }
    return;
  },
};
