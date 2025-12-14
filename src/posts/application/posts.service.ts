import { PostInput } from '../router/dto/input/post.input';
import { CommentInput } from '../../comments/router/dto/input/comment.input';
import { BlogsRepository } from '../../blogs/infrasturcture/repositories/blogs.repository';
import { PostsRepository } from '../infrasturcture/repositories/posts.repository';
import { CommentsRepository } from '../../comments/infrasctructure/repositories/comments.repository';
import { UsersRepository } from '../../users/repositories/users.repository';
import { injectable } from 'inversify';
import { PostEntity, PostModel } from '../domain/postEntity';
import {
  CommentEntity,
  CommentModel,
} from '../../comments/domain/commentEntity';
import { PostLikesRepository } from '../infrasturcture/repositories/post-likes.repository';
import { PostLikeEntity, PostLikesModel } from '../domain/postLikeEntity';

@injectable()
export class PostsService {
  constructor(
    public readonly blogsRepository: BlogsRepository,
    public readonly postsRepository: PostsRepository,
    public readonly commentsRepository: CommentsRepository,
    public readonly usersRepository: UsersRepository,
    public readonly postLikesRepository: PostLikesRepository,
  ) {}

  async create(postDto: PostInput): Promise<string> {
    const blog = await this.blogsRepository.findByIdOrError(postDto.blogId);
    const post = new PostModel(PostEntity.createNew(postDto, blog));
    const createdPost = await this.postsRepository.create(post);
    return createdPost._id.toString();
  }

  async delete(id: string): Promise<void> {
    await this.postsRepository.findByIdOrError(id);
    await this.postsRepository.delete(id);
    return;
  }

  async update(id: string, dto: PostInput): Promise<void> {
    const post = await this.postsRepository.findByIdOrError(id);
    post.update(dto);
    await this.postsRepository.update(id, dto);
  }

  async createComment(
    postId: string,
    commentDto: CommentInput,
    userId: string,
  ): Promise<string> {
    await this.postsRepository.findByIdOrError(postId); // ensure the post is available
    const user = await this.usersRepository.findByIdOrError(userId);

    const comment = new CommentModel(
      CommentEntity.createNew({
        content: commentDto.content,
        postId,
        commentatorInfo: { userId: userId, userLogin: user.login },
      }),
    );
    return await this.commentsRepository.create(comment);
  }

  async postLike(
    likeStatus: string,
    postId: string,
    userId: string,
  ): Promise<void> {
    let post = await this.postsRepository.findByIdOrError(postId);
    let user = await this.usersRepository.findByIdOrError(userId);
    let like = await this.postLikesRepository.find(userId, postId);

    if (like === null) {
      const newLike = new PostLikesModel(
        PostLikeEntity.createNew({
          postId: postId.toString(),
          userId: userId.toString(),
          userLogin: user.login,
          likeStatus,
        }),
      );

      post.updateLikeCount(likeStatus);
      await this.postLikesRepository.create(newLike);
    } else {
      if (likeStatus === like.myStatus) {
        return;
      }
      const oldStatus = like.myStatus;
      like.updateLikeStatus(likeStatus);
      post.updateLikeCount(likeStatus, oldStatus);

      await this.postLikesRepository.update(like);
    }
    const newestLikes = await this.getNewestLikes(postId);
    post.updateNewestLikes(newestLikes);
    await this.postsRepository.save(post);
    return;
  }

  async getNewestLikes(postId: string) {
    const lastLikes = await this.postLikesRepository.findLastLikes(postId);

    if (!lastLikes) return [];
    return lastLikes.map((like) => {
      return {
        addedAt: like.addedAt,
        userId: like.userId,
        login: like.userLogin,
      };
    });
  }
}
