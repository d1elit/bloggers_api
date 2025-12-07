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

  // async postLike(postId: string) {
  //
  // }

  async postLike(
    likeStatus: string,
    postId: string,
    userId: string,
  ): Promise<void> {
    console.log('Im inside POSTLIKE 2');
    // console.log('userId', userId);
    let post = await this.postsRepository.findByIdOrError(postId);
    let user = await this.usersRepository.findByIdOrError(userId);
    if (userId) {
      console.log('YA TYT');
      let like = await this.postLikesRepository.find(userId, postId);
      console.log('Like', like);
      if (like === null) {
        console.log('INSIDE IF 1');

        const newLike = new PostLikesModel();
        console.log('INSIDE IF 2');
        newLike.userId = userId.toString();
        newLike.postId = postId.toString();
        newLike.myStatus = likeStatus;
        newLike.userLogin = user.login;

        // newLike.newestLikes = {
        //   addedAt: new Date().toISOString(),
        //   userId: user._id.toString(),
        //   login: user.login,
        // };
        console.log('Like', newLike);
        likeStatus === 'Like'
          ? (post.extendedLikesInfo.likesCount += 1)
          : (post.extendedLikesInfo.dislikesCount += 1);
        await this.postsRepository.save(post);
        console.log('likStatyse', likeStatus);
        console.log('NEW LIKE', newLike);
        await this.postLikesRepository.create(newLike);
        console.log('INSIDE IF 3');
        return;
      }
      if (likeStatus === like.myStatus) {
        return;
      }

      like.myStatus = likeStatus;
      await this.postLikeControl(likeStatus, post, like);
      await this.postLikesRepository.update(like);
      return;
    }
    // console.log(comment);
  }

  async postLikeControl(
    likeStatus: string,
    post: PostDocument,
    like: PostLikeDocument,
  ): Promise<void> {
    if (likeStatus === 'None') {
      like.myStatus === 'Like'
        ? (post.extendedLikesInfo.likesCount -= 1)
        : (post.extendedLikesInfo.dislikesCount -= 1);
    }
    if (likeStatus === 'Like') {
      post.extendedLikesInfo.likesCount += 1;
      post.extendedLikesInfo.dislikesCount -= 1;
    }
    if (likeStatus === 'Dislike') {
      post.extendedLikesInfo.likesCount -= 1;
      post.extendedLikesInfo.dislikesCount += 1;
    }
    await this.postsRepository.save(post);
  }
}
