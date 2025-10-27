import {Express} from "express";
import request from "supertest";
import {BLOGS_PATH} from "../../../src/core/path";
import {HttpStatus} from "../../../src/core/types/http-statuses";
import {generateBasicAuthToken} from "../generate-admin-auth-token";
import {BlogOutput} from "../../../src/blogs/router/output/blog.output";

export async function getBlogById (app: Express, id:string): Promise<BlogOutput> {
    const blog = await request(app)
        .get(BLOGS_PATH + "/" + id)
        .set('Authorization', generateBasicAuthToken())
        .expect(HttpStatus.Ok)

    return blog.body
}