import { WithId } from 'mongodb';
import { Blog } from '../../types/blog';
import { BlogViewModel } from '../../models/blogVIewModel';

export function mapToBlogViewModel(blog: WithId<Blog>): BlogViewModel {
  return {
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  };
}
