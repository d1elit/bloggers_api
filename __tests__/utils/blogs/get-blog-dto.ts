import { BlogInput } from '../../../src/blogs/router/dto/input/blog.input';

export function getBlogDto(): BlogInput {
  return {
    name: 'How to learn js',
    description: 'Know how to learn js',
    websiteUrl: 'https://www.howtolearn.com',
  };
}
