import { Express } from 'express';
import { PostInput } from '../../../src/posts/router/input/post.input';
import { PostOutput } from '../../../src/posts/router/output/post.output';
import request from 'supertest';
import { POSTS_PATH } from '../../../src/core/path';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { getPostDto } from './get-post-dto';

export async function createPost(
  app: Express,
  blogID: string,
  postDto?: PostInput,
): Promise<PostOutput> {
  let defaultPostDto: PostInput = getPostDto(blogID);

  const testPostData = { ...defaultPostDto, ...postDto };

  const createPostResponse = await request(app)
    .post(POSTS_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(testPostData)
    .expect(HttpStatus.Created);

  return createPostResponse.body;
}
