import { Express } from 'express';
import request from 'supertest';
import { POSTS_PATH } from '../../../src/core/path';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { HttpStatus } from '../../../src/core/types/http-statuses';

export async function getPostById(app: Express, postId: string) {
  let post = await request(app)
    .get(`${POSTS_PATH}/${postId}`)
    .set('Authorization', generateBasicAuthToken())
    .expect(HttpStatus.Ok);
  return post.body;
}
