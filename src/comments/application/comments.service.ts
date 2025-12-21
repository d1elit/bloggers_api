import { CommentInput } from '../router/dto/input/comment.input';
import { CommentsRepository } from '../infrasctructure/repositories/comments.repository';
import { AccessError } from '../../core/errors/domain.errors';
import { injectable } from 'inversify';
import { LikesRepository } from '../infrasctructure/repositories/likes.repository';
import { CommentLikeEntity } from '../domain/commentLikeEntity';

@injectable()
export class CommentsService {
  constructor(
    public readonly commentsRepository: CommentsRepository,
    public readonly likesRepository: LikesRepository,
  ) {}

  async delete(commentId: string, userId: string): Promise<void> {
    await this.commentsRepository.findByIdOrError(commentId);
    await this.isUserOwner(commentId, userId);
    return await this.commentsRepository.delete(commentId);
  }

  async update(commentId: string, userId: string, commentDto: CommentInput) {
    const comment = await this.commentsRepository.findByIdOrError(commentId);
    await this.isUserOwner(commentId, userId);
    comment.update(commentDto);
    await this.commentsRepository.save(comment);
    return;
  }

  async isUserOwner(commentId: string, userID: string) {
    let comment = await this.commentsRepository.findByIdOrError(commentId);
    if (comment.commentatorInfo.userId !== userID) {
      throw new AccessError('Access denied');
    }
    return;
  }

  async likeStatus(
    likeStatus: string,
    commentId: string,
    userId?: string,
  ): Promise<void> {
    let comment = await this.commentsRepository.findByIdOrError(commentId);
    if (userId) {
      let like = await this.likesRepository.find(userId, commentId);

      if (like === null) {
        const newLike = CommentLikeEntity.createNew({
          userId,
          commentId,
          myStatus: likeStatus,
        });

        comment.updateLikeCount(likeStatus);

        await this.likesRepository.create(newLike);
      } else {
        if (likeStatus === like.myStatus) {
          return;
        }
        const oldStatus = like.myStatus;
        like.myStatus = likeStatus;
        comment.updateLikeCount(likeStatus, oldStatus);
        await this.likesRepository.update(like);
      }
      await this.commentsRepository.save(comment);
    }
  }
}
