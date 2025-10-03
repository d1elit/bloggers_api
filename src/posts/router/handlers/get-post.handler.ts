import {RequestWithParams} from "../../../core/types/requestTypes";
import {Response} from 'express'
import {HttpStatus} from "../../../core/types/http-statuses";
import {PostViewModel} from "../../models/postViewModel";
import {ErroreType} from "../../../blogs/types/validationError";
import {mapToPostViewModel} from "../mappers/map-to-post-view-model";
import {postsService} from "../../application/posts.service";
import {errorsHandler} from "../../../core/errors/errors.handler";

export async function getPostHandler (
    req: RequestWithParams<{ id: string }>,
    res: Response<PostViewModel | ErroreType>): Promise<void> {
    try {
        let id = req.params.id;
        let post = await postsService.findByIdOrError(id);
        const postViewModel = mapToPostViewModel(post);
        res.status(HttpStatus.Ok).send(postViewModel);
    } catch(e: unknown) {
        errorsHandler(e,res)
    }

}