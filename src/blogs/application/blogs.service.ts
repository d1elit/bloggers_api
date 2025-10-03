import { Blog } from '../types/blog';
import { BlogInputModel } from '../models/blogInputModel';

import { blogsRepository } from '../repositories/blogs.db-repository';
import { WithId } from 'mongodb';
import { Post } from '../../posts/types/post';

export const blogsService = {
  async findAll(): Promise<WithId<Blog>[]> {
    return blogsRepository.findAll();
  },
  async findByIdOrError(id: string): Promise<WithId<Blog>> {
    return blogsRepository.findByIdOrError(id);
  },
  async create(dto: BlogInputModel): Promise<WithId<Blog>> {
    const newBlog: Blog = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };
    return blogsRepository.create(newBlog);
  },
  async delete(id: string): Promise<void> {
    await blogsRepository.delete(id);
  },
  async update(id: string, dto: BlogInputModel): Promise<void> {
    await blogsRepository.update(id, dto);
    return;
  },
};
