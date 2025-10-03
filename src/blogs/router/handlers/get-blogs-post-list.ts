import {Request, Response} from 'express';
import {blogsService} from "../../application/blogs.service";
import {RequestWithParams} from "../../../core/types/requestTypes";
import {errorsHandler} from "../../../core/errors/errors.handler";




export async function getBlogsPostList (
    req: RequestWithParams<{id: string}>,
    res: Response,
) {

    try {
        const id = req.params.id;
        const blogsPostsList = await blogsService.findPosts(id);
        res.send(blogsPostsList);
    } catch ( e: unknown) {
        errorsHandler(e, res);
    }
}