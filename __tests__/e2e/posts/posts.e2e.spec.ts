import {describe} from "node:test";
import express from "express";
import {setupApp} from "../../../src/setup-app";
import {generateBasicAuthToken} from "../../utils/generate-admin-auth-token";
import {runDB, stopDb} from "../../../src/db/mongo.db";
import {clearDb} from "../../utils/clear-db";
import {PostInput} from "../../../src/posts/router/input/post.input";
import {getPostDto} from "../../utils/posts/get-post-dto";
import {createPost} from "../../utils/posts/create-post";
import {createBlog} from "../../utils/blogs/create-blog";
import { POSTS_PATH} from "../../../src/core/path";
import request from "supertest";
import {HttpStatus} from "../../../src/core/types/http-statuses";
import {PostOutput} from "../../../src/posts/router/output/post.output";
import {getPostById} from "../../utils/posts/get-post-by-id";
import {BlogOutput} from "../../../src/blogs/router/output/blog.output";


describe('POSTS_TESTS', ()=> {
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
    describe('✅ POST /posts', () => {

        it('POST /posts: Should create a post; ', async () => {
            const blog = await createBlog(app)
            const newPost: PostInput  = {
                ...getPostDto(blog.id),
                title: "Test post",
                shortDescription: "Test description"
            };
            await createPost(app, blog.id, newPost)
        })
    })

    describe('✅ GET /posts', () => {

        it('GET /posts: Should return posts list; ', async () => {
            const blog = await createBlog(app)
            await createPost(app, blog.id)
            await createPost(app, blog.id)

            const PostResponse = await request(app)
                .get(POSTS_PATH)
                .set('Authorization', adminToken)
                .expect(HttpStatus.Ok);

            expect(PostResponse.body.items).toBeInstanceOf(Array);
            expect(PostResponse.body.items.length).toBeGreaterThanOrEqual(2)
        })
    })

    describe('✅ GET /posts:id', () => {
        it('GET /posts:id : Should return post by id', async () => {
            const createdBlog = await createBlog(app)
            let createdPost: PostOutput = await createPost(app, createdBlog.id)
            const post = await getPostById(app, createdPost.id)
            expect(post).toEqual({
                ...createdPost
            })
        })
        it
    })

    describe('✅ DELETE /posts:id', () => {
        it('DELETE /posts:id : Should delete post by id', async () => {
            const createdBlog = await createBlog(app)
            let createdPost: PostOutput = await createPost(app, createdBlog.id)

            await request(app)
                .delete(POSTS_PATH + "/" + createdPost.id)
                .set('Authorization', adminToken)
                .expect(HttpStatus.NoContent)

            await request(app)
                .get(POSTS_PATH + "/" + createdPost.id)
                .set('Authorization', adminToken)
                .expect(HttpStatus.NotFound)
        })
    })

    describe('✅ UPDATE /posts:id', () => {
        it('UPDATE /posts:id : Should update post by id', async () => {
            const createdBlog: BlogOutput = await createBlog(app)
            let createdPost: PostOutput = await createPost(app, createdBlog.id)

            const postUpdateDto = {
                title:'Updated Post',
                shortDescription: 'Updated description',
                content: "Mega ultra super content for updated post 2025 right now right here oh my god",
                blogId:createdBlog.id,
            }

            await request(app)
                .put(POSTS_PATH + "/" + createdPost.id)
                .set('Authorization', adminToken)
                .send(postUpdateDto)
                .expect(HttpStatus.NoContent)

            const updatedPost: PostOutput = await getPostById(app, createdPost.id)
            expect(updatedPost).toEqual({
                id: createdPost.id,
                title: postUpdateDto.title,
                shortDescription: postUpdateDto.shortDescription,
                content: postUpdateDto.content,
                createdAt: createdPost.createdAt,
                blogId: postUpdateDto.blogId,
                blogName: createdPost.blogName,
            })
        })
    })

})