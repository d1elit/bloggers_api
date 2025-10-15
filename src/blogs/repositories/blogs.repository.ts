import { Blog } from '../types/blog';
import { BlogInput } from '../router/input/blog.input';
import { ObjectId, WithId } from 'mongodb';
import { blogsCollection } from '../../db/mongo.db';
import { RepositoryNotFoundError } from '../../core/errors/repostory-not-found.error';
import { BlogQueryInput } from '../router/input/blog-query.input';

export const blogsRepository = {

  async create(newBlog: Blog): Promise<WithId<Blog>> {
    const insertResult = await blogsCollection.insertOne(newBlog);
    return { ...newBlog, _id: insertResult.insertedId };
  },
  async delete(id: string): Promise<void> {
    const deleteResult = await blogsCollection.deleteOne({
      _id: new ObjectId(id),
    });
    if (deleteResult.deletedCount < 1) {
      throw new RepositoryNotFoundError('blog not exist');
    }
    return;
  },
  async update(id: string, dto: BlogInput): Promise<void> {
    const res = await blogsCollection.findOne({ _id: new ObjectId(id) });
    if (!res) {
      throw new RepositoryNotFoundError('blog not exist');
    }
    await blogsCollection.updateOne({ _id: new ObjectId(id) }, { $set: dto });
    return;
  },
  async findByIdOrError(id: string): Promise<WithId<Blog>> {
    const res = await blogsCollection.findOne({ _id: new ObjectId(id) });
    if (!res) {
      throw new RepositoryNotFoundError('blog not exist');
    }
    return res;
  },
};
