import { commentsCollection } from '../../db/mongo.db';
import { Comment } from '../types/comment';
import { ObjectId } from 'mongodb';
import { RepositoryNotFoundError } from '../../core/errors/domain.errors';
import { CommentInput } from '../router/input/comment.input';

export const commentsRepository = {
  async create(newComment: Comment): Promise<string> {
    const insertResult = await commentsCollection.insertOne(newComment);
    return insertResult.insertedId.toString();
  },
  async delete(commentId: string): Promise<void> {
    await commentsCollection.deleteOne({ _id: new ObjectId(commentId) });
    return;
  },
  async update(id: string, dto: CommentInput) {
    await commentsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: dto },
    );
    return;
  },
  async findByIdOrError(id: string): Promise<Comment> {
    const result = await commentsCollection.findOne({ _id: new ObjectId(id) });
    if (!result) {
      throw new RepositoryNotFoundError('Comment not found');
    }
    return result;
  },
};
