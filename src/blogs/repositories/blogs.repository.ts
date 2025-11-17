import { Blog } from '../types/blog';
import { BlogInput } from '../router/input/blog.input';
import { ObjectId, WithId } from 'mongodb';
import { blogsCollection } from '../../db/mongo.db';
import { RepositoryNotFoundError } from '../../core/errors/domain.errors';

export class BlogsRepository {
  async create(newBlog: Blog): Promise<WithId<Blog>> {
    const insertResult = await blogsCollection.insertOne(newBlog);
    return { ...newBlog, _id: insertResult.insertedId };
  }

  async delete(id: string): Promise<void> {
    await blogsCollection.deleteOne({ _id: new ObjectId(id) });
    return;
  }

  async update(id: string, dto: BlogInput): Promise<void> {
    await blogsCollection.updateOne({ _id: new ObjectId(id) }, { $set: dto });
    return;
  }

  async findByIdOrError(id: string): Promise<WithId<Blog>> {
    const res = await blogsCollection.findOne({ _id: new ObjectId(id) });
    if (!res) {
      throw new RepositoryNotFoundError('blog not exist');
    }
    return res;
  }
}
