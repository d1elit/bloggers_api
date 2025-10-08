import { Blog } from '../types/blog';
import { BlogInput } from '../router/input/blog.input';

import { blogsRepository } from '../repositories/blogs.db-repository';
import { WithId } from 'mongodb';
import { Post } from '../../posts/types/post';
import {postsRepository} from "../../posts/repositories/posts.db-repository";
import {PostInput} from "../../posts/router/input/post.input";
import {BlogQueryInput} from "../router/input/blog-query.input";
import {PostQueryInput} from "../../posts/router/input/post-query.input";

export const blogsService = {
  async findAll(queryDto: BlogQueryInput): Promise<{items:WithId<Blog>[]; totalCount: number}> {
    return blogsRepository.findAll(queryDto);
  },
  async findByIdOrError(id: string): Promise<WithId<Blog>> {
    return blogsRepository.findByIdOrError(id);
  },
  async create(dto: BlogInput): Promise<WithId<Blog>> {
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
  async update(id: string, dto: BlogInput): Promise<void> {
    await blogsRepository.update(id, dto);
    return;
  },

  async findPosts(dto :PostQueryInput, id: string): Promise<{items:WithId<Post>[], totalCount: number}> {
    await blogsRepository.findByIdOrError(id)
    const queryDto = {
      ...dto,
      blogId:id
    }
    return await postsRepository.findAll(queryDto);
  },

  async createPost(id: string, dto:PostInput): Promise<WithId<Post>> {
    const blog = await blogsRepository.findByIdOrError(id)
    const newPostDto: Post = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: id,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };
    return postsRepository.create(newPostDto);
  }
};
