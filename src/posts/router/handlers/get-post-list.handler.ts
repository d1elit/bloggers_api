import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-statuses";
import {PostViewModel} from "../../models/postViewModel";
import {mapToPostViewModel} from "../mappers/map-to-post-view-model";
import {postsService} from "../../application/posts.service";


export async function  getPostListHandler (req: Request, res: Response<PostViewModel[]>) {
    const posts = await postsService.findAll();
    const postsViewModel = posts.map(mapToPostViewModel);
    res.status(HttpStatus.Ok).send(postsViewModel);
}