import { BlogInput } from '../../../src/blogs/router/input/blog.input';
import { Express } from 'express';
import { BLOGS_PATH } from '../../../src/core/path';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import request from 'supertest';
import { getBlogDto } from './get-blog-dto';
import { BlogOutput } from '../../../src/blogs/router/output/blog.output';

export async function createBlog(
  app: Express,
  blogDto?: BlogInput,
): Promise<BlogOutput> {
  const defaultBlogDto: BlogInput = getBlogDto();

  const testBlogData = { ...defaultBlogDto, ...blogDto };

  const createBlogResponse = await request(app)
    .post(BLOGS_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(testBlogData)
    .expect(HttpStatus.Created);

  return createBlogResponse.body;
}
