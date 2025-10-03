import { Blog } from '../types/blog';
import { BlogInputModel } from '../models/blogInputModel';
import { ObjectId, WithId } from 'mongodb';
import {blogsCollection, postsCollection} from '../../db/mongo.db';
import { RepositoryNotFoundError } from '../../core/errors/repostory-not-found.error';
import {Post} from "../../posts/types/post";

export const blogsRepository = {
  async findAll(): Promise<WithId<Blog>[]> {
    return blogsCollection.find({}).toArray();
  },
  async findByIdOrError(id: string): Promise<WithId<Blog>> {
    const res = await blogsCollection.findOne({ _id: new ObjectId(id) });
    if (!res) {
      throw new RepositoryNotFoundError('blog not exist');
    }
    return res;
  },
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
  async update(id: string, dto: BlogInputModel): Promise<void> {
    const res = await blogsCollection.findOne({ _id: new ObjectId(id) });
    if (!res) {
      throw new RepositoryNotFoundError('blog not exist');
    }
    await blogsCollection.updateOne({ _id: new ObjectId(id) }, { $set: dto });
    return;
  },
};
