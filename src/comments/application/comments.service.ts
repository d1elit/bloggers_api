import { CommentInput } from '../router/input/comment.input';
import { CommentsRepository } from '../repositories/comments.repository';
import { AccessError } from '../../core/errors/domain.errors';
import { injectable } from 'inversify';
import { LikesRepository } from '../repositories/likes.repository';
import { LikeDocument, LikesModel } from '../Schemas/likes.schema';
import { CommentDocument } from '../Schemas/comment.schema';

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

  async likeStatus(
    likeStatus: string,
    commentId: string,
    userId?: string,
  ): Promise<void> {
    // console.log('userId', userId);
    let comment = await this.commentsRepository.findByIdOrError(commentId);
    if (userId) {
      console.log('YA TYT');
      let like = await this.likesRepository.find(userId, commentId);
      console.log('Like', like);
      if (like === null) {
        console.log('INSIDE IF 1');

        const newLike = new LikesModel();
        console.log('INSIDE IF 2');
        newLike.userId = userId.toString();
        newLike.commentId = commentId.toString();
        newLike.myStatus = likeStatus;
        console.log('Like', newLike);
        likeStatus === 'Like'
          ? (comment.likesInfo.likesCount += 1)
          : (comment.likesInfo.dislikesCount += 1);
        await this.commentsRepository.save(comment);
        await this.likesRepository.create(newLike);
        console.log('INSIDE IF 3');
        return;
      }
      if (likeStatus === like.myStatus) {
        return;
      }

      like.myStatus = likeStatus;
      await this.commentsLikeControl(likeStatus, comment, like);
      await this.likesRepository.update(like);
      return;
    }
    // console.log(comment);
  }

  async commentsLikeControl(
    likeStatus: string,
    comment: CommentDocument,
    like: LikeDocument,
  ): Promise<void> {
    if (likeStatus === 'None') {
      like.myStatus === 'Like'
        ? (comment.likesInfo.likesCount -= 1)
        : (comment.likesInfo.dislikesCount -= 1);
    }
    if (likeStatus === 'Like') {
      comment.likesInfo.likesCount += 1;
      comment.likesInfo.dislikesCount -= 1;
    }
    if (likeStatus === 'Dislike') {
      comment.likesInfo.likesCount -= 1;
      comment.likesInfo.dislikesCount += 1;
    }
    await this.commentsRepository.save(comment);
  }
}
