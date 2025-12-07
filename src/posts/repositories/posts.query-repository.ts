import { PostQueryInput } from '../router/input/post-query.input';
import { RepositoryNotFoundError } from '../../core/errors/domain.errors';
import { mapToPostListPaginated } from '../router/mappers/map-to-post-list-paginated';
import { postListPaginatedOutput } from '../router/output/post-list-paginated.output';
import { injectable } from 'inversify';
import { PostModel } from '../Schemas/post.schema';
import { container } from '../../composition-root';

import { PostLikesRepository } from './post-likes.repository';
import { mapToPostViewModel } from '../router/mappers/map-to-post-view-model';
import { PostOutput } from '../router/output/post.output';

@injectable()
export class PostsQueryRepository {
  async findAll({
    queryDto,
    blogId,
    userId,
  }: {
    queryDto: PostQueryInput;
    blogId?: string;
    userId?: string;
  }): Promise<postListPaginatedOutput> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      title,
      shortDescription,
      content,
      blogName,
    } = queryDto;
    const skip = (+pageNumber - 1) * +pageSize;
    const filter: any = {};
    if (blogId) {
      filter.blogId = { $regex: blogId, $options: 'i' };
    }
    if (title) {
      filter.title = { $regex: title, $options: 'i' };
    }
    if (shortDescription) {
      filter.shortDescription = { $regex: shortDescription, $options: 'i' };
    }
    if (content) {
      filter.content = { $regex: content, $options: 'i' };
    }
    if (blogName) {
      filter.blogName = { $regex: blogName, $options: 'i' };
    }
    const items = await PostModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(+pageSize);

    // const usersRepository = container.get(UsersRepository);
    const postLikesRepository =
      container.get<PostLikesRepository>(PostLikesRepository);
    const itemsIds = items.map((item) => item._id.toString());
    let likes = await postLikesRepository.findByIds(itemsIds, userId);

    // let likesLast = await postLikesRepository.findLastLikes(itemsIds);
    // console.log('LAST LIKES', likesLast);

    const totalCount = await PostModel.countDocuments(filter);

    return mapToPostListPaginated(
      items,
      {
        pageNumber: pageNumber,
        pageSize: pageSize,
        totalCount,
      },
      likes,
    );
  }

  async findByIdOrError(id: string, likeStatus?: string): Promise<PostOutput> {
    const res = await PostModel.findById(id);
    if (!res) {
      throw new RepositoryNotFoundError('Post not found');
    }
    return mapToPostViewModel(res, likeStatus);
  }

  async findPostWithLikeOrError(
    postId: string,
    userId: string,
  ): Promise<PostOutput> {
    const post = await PostModel.findById(postId);
    if (!post) {
      throw new RepositoryNotFoundError('Post not found');
    }
    const postLikesRepository =
      container.get<PostLikesRepository>(PostLikesRepository);

    const like = await postLikesRepository.find(userId, post._id.toString());

    return mapToPostViewModel(post, like?.myStatus);
  }
}
