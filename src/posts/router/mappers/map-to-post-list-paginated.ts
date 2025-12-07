import { postListPaginatedOutput } from '../output/post-list-paginated.output';
import { PostDocument } from '../../Schemas/post.schema';
import { PostLikeDocument } from '../../Schemas/postLikes.schema';

export function mapToPostListPaginated(
  posts: PostDocument[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
  likes?: PostLikeDocument[] | undefined,
): postListPaginatedOutput {
  console.log('LIKES:', likes);
  return {
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    page: +meta.pageNumber,
    pageSize: +meta.pageSize,
    totalCount: meta.totalCount,
    items: posts.map((post) => {
      let postLike = likes?.find((l) => l.postId === post._id.toString());

      console.log('postLike', postLike);
      return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
          likesCount: post.extendedLikesInfo.likesCount,
          dislikesCount: post.extendedLikesInfo.dislikesCount,
          myStatus: postLike?.myStatus ?? 'None',
          newestLikes: post.extendedLikesInfo.newestLikes,
        },
      };
    }),
  };
}
