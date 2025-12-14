import { BlogOutput } from '../output/blog.output';
import { BlogDocument } from '../../../domain/blogEntity';

export function mapToBlogView(blog: BlogDocument): BlogOutput {
  return {
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  };
}
