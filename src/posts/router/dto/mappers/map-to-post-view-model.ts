import { PostOutput } from '../output/post.output';
import { PostDocument } from '../../../domain/postEntity';

export function mapToPostViewModel(
  post: PostDocument,
  postLike?: string | undefined,
): PostOutput {
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
      myStatus: postLike ?? 'None',
      newestLikes: post.extendedLikesInfo.newestLikes,
    },
  };
}
