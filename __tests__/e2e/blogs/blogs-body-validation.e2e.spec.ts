import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { clearDb } from '../../utils/clear-db';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import request from 'supertest';
import { BLOGS_PATH } from '../../../src/core/path';
import { describe } from 'node:test';
import { getBlogDto } from '../../utils/blogs/get-blog-dto';
import { BlogOutput } from '../../../src/blogs/router/output/blog.output';
import { createBlog } from '../../utils/blogs/create-blog';
import { getBlogById } from '../../utils/blogs/get-blog-by-id';

describe('BLOGS_VALIDATION', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();
  beforeAll(async () => {
    await runDB('mongodb://localhost:27017/db-test');
    await clearDb(app);
  });
  afterAll(async () => {
    await stopDb();
  });

  describe('✅ POST /blogs validation', () => {
    it('POST /blog: Should not create blog if user unauthorized ', async () => {
      await request(app)
        .post(BLOGS_PATH)
        .send(getBlogDto())
        .expect(HttpStatus.Unauthorized);
    });
    it('POST /blog: Should not create blog if data is invalid', async () => {
      const invalidDto1 = await request(app)
        .post(BLOGS_PATH)
        .set('Authorization', adminToken)
        .send({
          ...getBlogDto(),
          name: '1', // short name
          description: '', // empty string,
          websiteUrl: 'howtolearn.com', // wrongUri format
        })
        .expect(HttpStatus.BadRequest);
      expect(invalidDto1.body.errorsMessages).toHaveLength(3);
    });
    it('POST /blog: Blogs DB should be empty if blogs not created', async () => {
      const driverListResponse = await request(app)
        .get(BLOGS_PATH)
        .set('Authorization', adminToken);
      expect(driverListResponse.body.items).toHaveLength(0);
    });
  });

  describe('✅ Update /blogs validation', async () => {
    it('UPDATE /blogs:id : should not update blog with invalid dto', async () => {
      const createdBlog: BlogOutput = await createBlog(app);

      const blogUpdateDto = {
        name: 'Ud', // short name
        description: 'n', // short description
        websiteUrl: 'https://stacode-js', // wrong URI
      };

      const invalidUpdate = await request(app)
        .put(BLOGS_PATH + '/' + createdBlog.id)
        .set('Authorization', adminToken)
        .send(blogUpdateDto)
        .expect(HttpStatus.BadRequest);

      expect(invalidUpdate.body.errorsMessages).toHaveLength(3);
      const blogResponse: BlogOutput = await getBlogById(app, createdBlog.id);
      expect(blogResponse).toEqual({
        ...createdBlog,
      });
    });
  });
});
