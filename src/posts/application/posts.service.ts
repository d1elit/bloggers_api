import { Post } from '../types/post';
import { PostInputModel } from '../models/postInputModel';
import {  WithId } from 'mongodb';
import { postsRepository } from '../repositories/posts.db-repository';
import {RepositoryNotFoundError} from "../../core/errors/repostory-not-found.error";
import {blogsRepository} from "../../blogs/repositories/blogs.db-repository";

export const postsService = {
  async findAll(): Promise<WithId<Post>[]> {
    return postsRepository.findAll();
  },
  async findByIdOrError(id: string): Promise<WithId<Post>> {
    return postsRepository.findByIdOrError(id);
  },
  async create(dto: PostInputModel, blogId?: string): Promise<WithId<Post>> {
    const blog = await blogsRepository.findByIdOrError(dto.blogId);

    if (!blog) {
      throw new RepositoryNotFoundError(`Blog with id ${dto.blogId} not found!`);
    }

    const newPostDto: Post = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: blogId ?? dto.blogId,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };

    return await postsRepository.create(newPostDto);

  },
  async delete(id: string): Promise<void> {
    await postsRepository.delete(id);
    return;
  },
  async update(id: string, dto: PostInputModel): Promise<void> {
    await postsRepository.update(id, dto);
    return;
  },
};
