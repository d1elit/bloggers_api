import { PostInput } from '../router/input/post.input';
import { RepositoryNotFoundError } from '../../core/errors/domain.errors';
import { CommentInput } from '../../comments/router/input/comment.input';
import { BlogsRepository } from '../../blogs/repositories/blogs.repository';
import { PostsRepository } from '../repositories/posts.repository';
import { CommentsRepository } from '../../comments/repositories/comments.repository';
import { UsersRepository } from '../../users/repositories/users.repository';
import { injectable } from 'inversify';
import { PostDocument, PostModel } from '../Schemas/post.schema';
import { CommentModel } from '../../comments/Schemas/comment.schema';
import { PostLikesRepository } from '../repositories/post-likes.repository';
import { PostLikeDocument, PostLikesModel } from '../Schemas/postLikes.schema';

@injectable()
export class PostsService {
  constructor(
    public readonly blogsRepository: BlogsRepository,
    public readonly postsRepository: PostsRepository,
    public readonly commentsRepository: CommentsRepository,
    public readonly usersRepository: UsersRepository,
    public readonly postLikesRepository: PostLikesRepository,
  ) {}

  async create(dto: PostInput, blogId?: string): Promise<PostDocument> {
    const blog = await this.blogsRepository.find(dto.blogId);

    if (!blog) {
      throw new RepositoryNotFoundError(
        `Blog with id ${dto.blogId} not found or ${blogId}, not found!`,
      );
    }

    const post = new PostModel();

    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.blogId = blogId ?? dto.blogId;
    post.blogName = blog.name;
    post.createdAt = new Date().toISOString();
    post.extendedLikesInfo = {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: 'None',
      newestLikes: [],
    };

    return await this.postsRepository.create(post);
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
    const comment = new CommentModel();
    comment.content = commentDto.content;
    comment.commentatorInfo = {
      userId: userId,
      userLogin: user.login,
    };
    comment.postId = post._id.toString();
    comment.likesInfo = {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: 'none',
    };
    comment.createdAt = new Date().toISOString();

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
      const newLike = new PostLikesModel();

      newLike.userId = userId.toString();
      newLike.postId = postId.toString();
      newLike.myStatus = likeStatus;
      newLike.userLogin = user.login;

      this.postLikeControl(post, newLike, likeStatus);
      await this.postLikesRepository.create(newLike);
    } else {
      if (likeStatus === like.myStatus) {
        return;
      }
      let oldStatus = like.myStatus;

      like.myStatus = likeStatus;
      this.postLikeControl(post, like, likeStatus, oldStatus);
      await this.postLikesRepository.update(like);
    }
    post.extendedLikesInfo.newestLikes = await this.getNewestLikes(postId);
    await this.postsRepository.save(post);
    return;
  }

  postLikeControl(
    post: PostDocument,
    like: PostLikeDocument,
    likeStatus: string,
    oldLikeStatus?: string,
  ) {
    if (oldLikeStatus === 'Like') post.extendedLikesInfo.likesCount -= 1;
    if (oldLikeStatus === 'Dislike') post.extendedLikesInfo.dislikesCount -= 1;

    if (likeStatus === 'Like') {
      post.extendedLikesInfo.likesCount += 1;
    }
    if (likeStatus === 'Dislike') {
      post.extendedLikesInfo.dislikesCount += 1;
    }
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
