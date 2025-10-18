import { Post } from '../types/post';
import { PostInput } from '../router/input/post.input';
import {ObjectId, WithId} from 'mongodb';
import { postsRepository } from '../repositories/posts.repository';
import { RepositoryNotFoundError } from '../../core/errors/repostory-not-found.error';
import {blogsRepository} from "../../blogs/repositories/blogs.repository";
import {CommentInput} from "../../comments/router/input/comment.input";
import {commentsRepository} from "../../comments/repositories/comments.repository";
import {Comment} from "../../comments/types/comment";
import {usersRepository} from "../../users/repositories/users.repository";

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

  async createComment(postId:string , commentDto: CommentInput, userId: string) :Promise<string> {
    const post = await postsRepository.findByIdOrError(postId)
    const user = await usersRepository.findByIdOrError(userId);
    if (!post) {
      throw new RepositoryNotFoundError('Post not found');
    }
    const newComment: Comment = {
      content: commentDto.content,
      commentatorInfo: {
        userId: userId,
        userLogin: user.login,
      },
      postId: post._id.toString(),
      createdAt: new Date().toISOString()
    }
    return await commentsRepository.create(newComment);
  }
};
