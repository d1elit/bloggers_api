import {RequestWithParams} from "../../../core/types/requestTypes";
import {Response} from 'express'
import {HttpStatus} from "../../../core/types/http-statuses";
import {createErrorMessages} from "../../../core/utils/error.utils";
import {PostViewModel} from "../../models/postViewModel";
import {ErroreType} from "../../../blogs/types/validationError";
import {mapToPostViewModel} from "../mappers/map-to-post-view-model";
import {postsService} from "../../application/posts.service";

export async function getPostHandler (
    req: RequestWithParams<{ id: string }>,
    res: Response<PostViewModel | ErroreType>): Promise<void> {

    let id = req.params.id;
    let post = await postsService.findByIdOrError(id);

    if(!post) {
        res
            .status(HttpStatus.NotFound)
            .send(createErrorMessages([{ message: 'Post not found', field: 'id' }]));
        return
    }
    const postViewModel = mapToPostViewModel(post);

    res.send(postViewModel);
}