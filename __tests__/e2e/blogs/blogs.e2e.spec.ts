import request from 'supertest';
import express from 'express';
import {setupApp} from "../../../src/setup-app";
import {HttpStatus} from "../../../src/core/types/http-statuses";
import {runDB, stopDb} from "../../../src/db/mongo.db";
import {clearDb} from "../../utils/clear-db";
import {generateBasicAuthToken} from "../../utils/generate-admin-auth-token";
import {BLOGS_PATH} from "../../../src/core/path";
import {describe} from "node:test";
import {createBlog} from "../../utils/blogs/create-blog";
import {BlogInput} from "../../../src/blogs/router/input/blog.input";
import {getBlogDto} from "../../utils/blogs/get-blog-dto";
import {getBlogById} from '../../utils/blogs/get-blog-by-id';
import {BlogOutput} from "../../../src/blogs/router/output/blog.output";
import {createPost} from "../../utils/posts/create-post";
import {getPostById} from "../../utils/posts/get-post-by-id";



describe('BLOGS_TESTS', () => {
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


    describe('✅ POST /blogs', () => {
        it('POST /blog: Should create a blog; ', async () => {
            const newBlog: BlogInput = {
                ...getBlogDto(),
                name: "Test blog",
                description: "Test description"
            };
            await createBlog(app, newBlog)
        })
    })
    describe('✅ GET /blogs', () => {
        it('GET /blogs: Should return blog list', async () => {
            await createBlog(app)
            await createBlog(app)

            const BlogsListResponse = await request(app)
                .get(BLOGS_PATH)
                .set('Authorization', adminToken)
                .expect(HttpStatus.Ok)

            expect(BlogsListResponse.body.items).toBeInstanceOf(Array)
            expect(BlogsListResponse.body.items.length).toBeGreaterThanOrEqual(2)
        })
    })
    describe('✅ GET /blogs:id', () => {
        it('GET /blogs:id : Should return blog by id', async () => {
            const createdBlog = await createBlog(app)
            const blog = await getBlogById(app, createdBlog.id)
            expect(blog).toEqual({
                ...createdBlog
            })
        })
        it
    })
    describe('✅ DELETE /blogs:id', () => {
        it('DELETE /blogs:id : Should delete blog by id', async () => {
            const createdBlog = await createBlog(app)

            await request(app)
                .delete(BLOGS_PATH + "/" + createdBlog.id)
                .set('Authorization', adminToken)
                .expect(HttpStatus.NoContent)

            await request(app)
                .get(BLOGS_PATH + "/" + createdBlog.id)
                .set('Authorization', adminToken)
                .expect(HttpStatus.NotFound)
        })

    })
    describe('✅ UPDATE /blogs:id', () => {
        it('UPDATE /blogs:id : Should update blog by id', async () => {
            const createdBlog: BlogOutput = await createBlog(app)


            const blogUpdateDto = {
                name:'Updated Blog',
                description: 'Updated description',
                websiteUrl: "https://stackoverflow.com/questions/70530523/missing-initializer-in-const-declaration-in-node-js"
            }

            await request(app)
                .put(BLOGS_PATH + "/" + createdBlog.id)
                .set('Authorization', adminToken)
                .send(blogUpdateDto)
                .expect(HttpStatus.NoContent)

            const updatedBlog: BlogOutput = await getBlogById(app, createdBlog.id)
            expect(updatedBlog).toEqual({
                id: createdBlog.id,
                name: blogUpdateDto.name,
                description: blogUpdateDto.description,
                websiteUrl: blogUpdateDto.websiteUrl,
                createdAt: createdBlog.createdAt,
                isMembership: createdBlog.isMembership,
            })
        })
    })
    describe('✅ GET /blogs:id/posts', () => {
        it('GET /blogs:id/posts : Should return all posts for specific blog', async () => {
            const createdBlog: BlogOutput = await createBlog(app)
            await createPost(app,  createdBlog.id)
            await createPost(app,  createdBlog.id)

            const postsResponse = await request(app)
                .get(BLOGS_PATH + "/" + createdBlog.id+'/posts')
                .set('Authorization', adminToken)
                .expect(HttpStatus.Ok)

            expect(postsResponse.body.items.length).toBeGreaterThanOrEqual(2)
            expect(postsResponse.body.items[1].blogId).toEqual(createdBlog.id)
            expect(postsResponse.body.items[0].blogName).toEqual(createdBlog.name)
        })
    })
    describe('✅ POST /blogs:id/posts', () => {
        it('POST /blogs:id/posts : Should create post for specific blog', async () => {
            const createdBlog: BlogOutput = await createBlog(app)
            let postDto =
            {
                title: "Post in blog",
                shortDescription:'Short description',
                content: "Conteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeent"
            }


            const response = await request(app)
                .post(BLOGS_PATH + "/" + createdBlog.id+'/posts')
                .set('Authorization', adminToken)
                .send(postDto)
                .expect(HttpStatus.Created)

            const post = await getPostById(app,response.body.id)
            expect(post).toEqual({
                id: post.id,
                title: postDto.title,
                shortDescription: postDto.shortDescription,
                content: postDto.content,
                createdAt: post.createdAt,
                blogId: createdBlog.id,
                blogName: createdBlog.name,
                })
        })
    })
})