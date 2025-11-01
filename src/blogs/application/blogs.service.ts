import { Blog } from '../types/blog';
import { BlogInput } from '../router/input/blog.input';
import { blogsRepository } from '../repositories/blogs.repository';
import { WithId } from 'mongodb';
import { Post } from '../../posts/types/post';
import { postsRepository } from '../../posts/repositories/posts.repository';
import { PostInput } from '../../posts/router/input/post.input';

export const blogsService = {
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
    await blogsRepository.findByIdOrError(id);
    await blogsRepository.delete(id);
  },
  async update(id: string, dto: BlogInput): Promise<void> {
    await blogsRepository.findByIdOrError(id);
    await blogsRepository.update(id, dto);
    return;
  },
  async createPost(id: string, dto: PostInput): Promise<WithId<Post>> {
    const blog = await blogsRepository.findByIdOrError(id);
    const newPostDto: Post = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: id,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };
    return postsRepository.create(newPostDto);
  },
};
