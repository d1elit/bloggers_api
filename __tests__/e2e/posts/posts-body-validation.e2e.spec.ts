import {describe} from "node:test";
import express from "express";
import {setupApp} from "../../../src/setup-app";
import {generateBasicAuthToken} from "../../utils/generate-admin-auth-token";
import {runDB, stopDb} from "../../../src/db/mongo.db";
import {clearDb} from "../../utils/clear-db";
import request from "supertest";
import {POSTS_PATH} from "../../../src/core/path";
import {HttpStatus} from "../../../src/core/types/http-statuses";
import {getPostDto} from "../../utils/posts/get-post-dto";
import {createBlog} from "../../utils/blogs/create-blog";
import {BlogOutput} from "../../../src/blogs/router/output/blog.output";
import {createPost} from "../../utils/posts/create-post";
import {getPostById} from "../../utils/posts/get-post-by-id";


describe('POSTS_VALIDATION', () => {
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


    describe('✅ POST /posts validation')
        it('POST /post: Should not create post if user unauthorized ', async () => {
            const blog = await createBlog(app);
            await request(app)
                .post(POSTS_PATH)
                .send(getPostDto(blog.id))
                .expect(HttpStatus.Unauthorized);
        });
    it('POST /post: Should not create post if data is invalid', async () => {
        const blog = await createBlog(app);
        const invalidDto1 = await request(app)
            .post(POSTS_PATH)
            .set('Authorization', adminToken)
            .send({
                ...getPostDto(blog.id),
                title: '1', // short title
                shortDescription: '', // empty string,
                content: '.m', // to short content
            })
            .expect(HttpStatus.BadRequest);
        expect(invalidDto1.body.errorsMessages).toHaveLength(3);
    });
    it('POST /post: Post DB should be empty if post not created', async () => {
        const driverListResponse = await request(app)
            .get(POSTS_PATH)
            .set('Authorization', adminToken);
        expect(driverListResponse.body.items).toHaveLength(0);
    });

    describe('✅ Update /posts validation', async () => {
        it('UPDATE /posts:id : should not update post with invalid dto', async () => {
            const createdBlog: BlogOutput = await createBlog(app);
            const createdPost = await createPost(app,createdBlog.id)
            const postUpdateDto = {
                title: '1', // short title
                shortDescription: '', // empty string,
                content: '.m', // to short content
                blogId: createdBlog.id,
            };

            const invalidUpdate = await request(app)
                .put(POSTS_PATH + '/' + createdPost.id)
                .set('Authorization', adminToken)
                .send(postUpdateDto)
                .expect(HttpStatus.BadRequest);

            expect(invalidUpdate.body.errorsMessages).toHaveLength(3);
            const postResponse = await getPostById(app, createdPost.id);
            expect(postResponse).toEqual({
                ...createdPost,
            });
        });
    });

})