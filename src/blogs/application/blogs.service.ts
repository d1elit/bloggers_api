import 'reflect-metadata';
import { BlogInput } from '../router/input/blog.input';
import { PostInput } from '../../posts/router/input/post.input';
import { BlogsRepository } from '../repositories/blogs.repository';
import { PostsRepository } from '../../posts/repositories/posts.repository';
import { injectable } from 'inversify';

import { PostDocument, PostModel } from '../../posts/Schemas/post.schema';
import { BlogModel } from '../Entity/blogSchema';

@injectable()
export class BlogsService {
  constructor(
    public readonly blogsRepository: BlogsRepository,
    public readonly postsRepository: PostsRepository,
  ) {}

  async create(dto: BlogInput): Promise<string> {
    const blog = new BlogModel();
    blog.create(dto);
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
    const post = new PostModel();
    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.blogId = id;
    post.blogName = blog.name;
    post.createdAt = new Date().toISOString();
    return this.postsRepository.create(post);
  }
}
