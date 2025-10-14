import { Post } from '../types/post';
import { PostInput } from '../router/input/post.input';
import { ObjectId, WithId } from 'mongodb';
import { postsCollection } from '../../db/mongo.db';
import { RepositoryNotFoundError } from '../../core/errors/repostory-not-found.error';

export const postsRepository = {

  async create(newPost: Post): Promise<WithId<Post>> {
    const insertResult = await postsCollection.insertOne(newPost);
    return { ...newPost, _id: insertResult.insertedId };
  },
  async delete(id: string): Promise<void> {
    const res = await postsCollection.findOne({ _id: new ObjectId(id) });
    if (!res) {
      throw new RepositoryNotFoundError('Post not found');
    }
    await postsCollection.deleteOne({ _id: new ObjectId(id) });
    return;
  },
  async update(id: string, dto: PostInput): Promise<void> {
    const res = await postsCollection.findOne({ _id: new ObjectId(id) });
    if (!res) {
      throw new RepositoryNotFoundError('Post not found');
    }
    await postsCollection.updateOne({ _id: new ObjectId(id) }, { $set: dto });
    return;
  },
};
