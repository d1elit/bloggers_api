import { Post } from '../types/post';
import { PostInput } from '../router/input/post.input';
import { WithId } from 'mongodb';
import { RepositoryNotFoundError } from '../../core/errors/domain.errors';
import { CommentInput } from '../../comments/router/input/comment.input';
import { Comment } from '../../comments/types/comment';
import { BlogsRepository } from '../../blogs/repositories/blogs.repository';
import { PostsRepository } from '../repositories/posts.repository';
import { CommentsRepository } from '../../comments/repositories/comments.repository';
import { UsersRepository } from '../../users/repositories/users.repository';

export class PostsService {
  constructor(
    public readonly blogsRepository: BlogsRepository,
    public readonly postsRepository: PostsRepository,
    public readonly commentsRepository: CommentsRepository,
    public readonly usersRepository: UsersRepository,
  ) {}

  async create(dto: PostInput, blogId?: string): Promise<WithId<Post>> {
    const blog = await this.blogsRepository.findByIdOrError(dto.blogId);

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

    return await this.postsRepository.create(newPostDto);
  }

  async delete(id: string): Promise<void> {
    await this.postsRepository.findByIdOrError(id);
    await this.postsRepository.delete(id);
    return;
  }

  async update(id: string, dto: PostInput): Promise<void> {
    await this.postsRepository.findByIdOrError(id);
    await this.postsRepository.update(id, dto);
    return;
  }

  async createComment(
    postId: string,
    commentDto: CommentInput,
    userId: string,
  ): Promise<string> {
    const post = await this.postsRepository.findByIdOrError(postId);
    const user = await this.usersRepository.findByIdOrError(userId);
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
      createdAt: new Date().toISOString(),
    };
    return await this.commentsRepository.create(newComment);
  }
}
