import 'reflect-metadata';
import { BlogInput } from '../router/dto/input/blog.input';
import { PostInput } from '../../posts/router/dto/input/post.input';
import { BlogsRepository } from '../infrasturcture/repositories/blogs.repository';
import { PostsRepository } from '../../posts/infrasturcture/repositories/posts.repository';
import { injectable } from 'inversify';

import {
  PostDocument,
  PostEntity,
  PostModel,
} from '../../posts/domain/postEntity';
import { BlogEntity } from '../domain/blogEntity';

@injectable()
export class BlogsService {
  constructor(
    public readonly blogsRepository: BlogsRepository,
    public readonly postsRepository: PostsRepository,
  ) {}

  async create(dto: BlogInput): Promise<string> {
    const blog = BlogEntity.createNew(dto);
    return await this.blogsRepository.save(blog);
  }

  async delete(id: string): Promise<void> {
    const blog = await this.blogsRepository.findByIdOrError(id);
    await this.blogsRepository.delete(blog);
  }

  async update(id: string, dto: BlogInput): Promise<void> {
    const blog = await this.blogsRepository.findByIdOrError(id);
    blog.update(dto);
    await this.blogsRepository.update(blog);
    return;
  }

  async createPost(id: string, postDto: PostInput): Promise<PostDocument> {
    const blog = await this.blogsRepository.findByIdOrError(id);
    console.log(blog);
    const post = new PostModel(PostEntity.createNew(postDto, blog));
    return this.postsRepository.create(post);
  }
}
