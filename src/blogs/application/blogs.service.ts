import 'reflect-metadata';
import { Blog } from '../types/blog';

import { BlogInput } from '../router/input/blog.input';
import { WithId } from 'mongodb';
import { Post } from '../../posts/types/post';
import { PostInput } from '../../posts/router/input/post.input';
import { BlogsRepository } from '../repositories/blogs.repository';
import { PostsRepository } from '../../posts/repositories/posts.repository';
import { injectable } from 'inversify';
import { BlogModel } from '../Schemas/blog.schema';
import { PostDocument } from '../../posts/Schemas/post.schema';

@injectable()
export class BlogsService {
  constructor(
    public readonly blogsRepository: BlogsRepository,
    public readonly postsRepository: PostsRepository,
  ) {}

  async create(dto: BlogInput): Promise<string> {
    const blog = new BlogModel();
    blog.name = dto.name;
    blog.description = dto.description;
    blog.websiteUrl = dto.websiteUrl;
    blog.createdAt = new Date().toISOString();
    blog.isMembership = false;

    return await this.blogsRepository.save(blog);
  }

  async delete(id: string): Promise<void> {
    let blog = await this.blogsRepository.findByIdOrError(id);
    await this.blogsRepository.delete(blog);
  }

  async update(id: string, dto: BlogInput): Promise<void> {
    let blog = await this.blogsRepository.findByIdOrError(id);
    blog.name = dto.name;
    blog.description = dto.description;
    blog.websiteUrl = dto.websiteUrl || blog.websiteUrl;
    await this.blogsRepository.update(blog);
    return;
  }

  async createPost(id: string, dto: PostInput): Promise<PostDocument> {
    const blog = await this.blogsRepository.findByIdOrError(id);
    const newPostDto: Post = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: id,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };
    return this.postsRepository.create(newPostDto);
  }
}
