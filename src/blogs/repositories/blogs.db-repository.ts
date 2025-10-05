import { Blog } from '../types/blog';
import { BlogInput } from '../router/input/blog.input';
import { ObjectId, WithId } from 'mongodb';
import {blogsCollection, postsCollection} from '../../db/mongo.db';
import { RepositoryNotFoundError } from '../../core/errors/repostory-not-found.error';
import {Post} from "../../posts/types/post";
import {PaginationAndSorting} from "../../core/types/pagination-and-sorting";
import {BlogQueryInput} from "../router/input/blog-query.input";

export const blogsRepository = {
  async findAll(queryDto: BlogQueryInput): Promise<{items:WithId<Blog>[]; totalCount: number}> {



    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      name,
      description,
      websiteUri
    } = queryDto
    const skip = (+pageNumber -1) * +pageSize;
    const filter: any = {};
    // console.log(searchBlogNameTerm);
    if(name) {
      filter.name = {$regex: name, $options: "i"};
    }
    if(description) {
      filter.description = {$regex: description, $options: "i"};
    }


    const items = await blogsCollection
      .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(+pageSize)
        .toArray();

    const totalCount = await blogsCollection.countDocuments(filter);

    return {items, totalCount};




    // return blogsCollection.find({}).toArray();
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
  async update(id: string, dto: BlogInput): Promise<void> {
    const res = await blogsCollection.findOne({ _id: new ObjectId(id) });
    if (!res) {
      throw new RepositoryNotFoundError('blog not exist');
    }
    await blogsCollection.updateOne({ _id: new ObjectId(id) }, { $set: dto });
    return;
  },
};
