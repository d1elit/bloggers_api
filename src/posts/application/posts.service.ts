import { Post } from '../types/post';
import { PostInput } from '../router/input/post.input';
import { WithId } from 'mongodb';
import { postsRepository } from '../repositories/posts.repository';
import { RepositoryNotFoundError } from '../../core/errors/repostory-not-found.error';
import {blogsRepository} from "../../blogs/repositories/blogs.repository";
import {CommentInput} from "../../comments/router/input/comment.input";

export const postsService = {
  async create(dto: PostInput, blogId?: string): Promise<WithId<Post>> {
    const blog = await blogsRepository.findByIdOrError(dto.blogId);

    if (!blog) {
      throw new RepositoryNotFoundError(
        `Blog with id ${dto.blogId} not found!`,
      );
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
  async update(id: string, dto: PostInput): Promise<void> {
    await postsRepository.update(id, dto);
    return;
  },

  // async createComment(postId:string , commentDto: CommentInput) {
  //     const post = await postsRepository.
  // }
};
