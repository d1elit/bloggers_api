import {RequestWithBody} from "../../../core/types/requestTypes";
import {BlogInputModel} from "../../models/blogInputModel";
import  {blogsService} from "../../application/blogs.service";
import {HttpStatus} from "../../../core/types/http-statuses";
import  {Response} from "express";
import {mapToBlogViewModel} from "../mappers/map-to-blog-view-model";
import {BlogViewModel} from "../../models/blogVIewModel";
import {errorsHandler} from "../../../core/errors/errors.handler";


export async function createBlogHandler (
    req: RequestWithBody<BlogInputModel>,
    res:Response
) {
    try {
        const createdBlog = await blogsService.create(req.body)
        const blogViewModel: BlogViewModel = mapToBlogViewModel(createdBlog)
        res.status(HttpStatus.Created).send(blogViewModel);
    } catch(e: unknown) {
        errorsHandler(e,res)
    }
}