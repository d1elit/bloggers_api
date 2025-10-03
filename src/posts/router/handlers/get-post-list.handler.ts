import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-statuses";
import {PostViewModel} from "../../models/postViewModel";
import {mapToPostViewModel} from "../mappers/map-to-post-view-model";
import {postsService} from "../../application/posts.service";
import {errorsHandler} from "../../../core/errors/errors.handler";


export async function  getPostListHandler (req: Request, res: Response<PostViewModel[]>) {

    try {
        const posts = await postsService.findAll();
        const postsViewModel = posts.map(mapToPostViewModel);
        res.status(HttpStatus.Ok).send(postsViewModel);
    } catch(e: unknown) {
        errorsHandler(e,res)
    }

}