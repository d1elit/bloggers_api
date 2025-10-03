import {RequestWithBody} from "../../../core/types/requestTypes";
import {Response} from "express";
import {HttpStatus} from "../../../core/types/http-statuses";
import {PostInputModel} from "../../models/postInputModel";
import {mapToPostViewModel} from "../mappers/map-to-post-view-model";
import {PostViewModel} from "../../models/postViewModel";
import {postsService} from "../../application/posts.service";

export async function createPostHandler (
    req: RequestWithBody<PostInputModel>,
    res:Response
) {

    try {
        const createdPost = await postsService.create(req.body);
        const postViewModel : PostViewModel = mapToPostViewModel(createdPost);
        res.status(HttpStatus.Created).send(postViewModel);
    } catch (e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
    }

