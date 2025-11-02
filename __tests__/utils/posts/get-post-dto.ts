import { PostInput } from '../../../src/posts/router/input/post.input';

export function getPostDto(blodId: string): PostInput {
  return {
    title: 'Pff',
    shortDescription: 'TEST DESC',
    content:
      'https://stackoverflow.com/questions/70530523/missing-initializer-in-const-declaration-in-node-js',
    blogId: blodId,
  };
}
