import { Blog } from '../types/blog';
import { BlogInput } from '../router/input/blog.input';
import { WithId } from 'mongodb';
import { Post } from '../../posts/types/post';
import { PostInput } from '../../posts/router/input/post.input';
import { BlogsRepository } from '../repositories/blogs.repository';
import { PostsRepository } from '../../posts/repositories/posts.repository';

export class BlogsService {
  constructor(
    public readonly blogsRepository: BlogsRepository,
    public readonly postsRepository: PostsRepository,
  ) {}

  async create(dto: BlogInput): Promise<WithId<Blog>> {
    const newBlog: Blog = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };
    return this.blogsRepository.create(newBlog);
  }

  async delete(id: string): Promise<void> {
    await this.blogsRepository.findByIdOrError(id);
    await this.blogsRepository.delete(id);
  }

  async update(id: string, dto: BlogInput): Promise<void> {
    await this.blogsRepository.findByIdOrError(id);
    await this.blogsRepository.update(id, dto);
    return;
  }

  async createPost(id: string, dto: PostInput): Promise<WithId<Post>> {
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
