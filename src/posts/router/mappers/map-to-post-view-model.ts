import { WithId } from 'mongodb';
import { Post } from '../../types/post';
import { PostOutput } from '../output/post.output';
import { PostDocument } from '../../Schemas/post.schema';

export function mapToPostViewModel(post: PostDocument): PostOutput {
  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
  };
}
