import {RequestWithParams} from "../../../core/types/requestTypes";
import {HttpStatus} from "../../../core/types/http-statuses";
import {createErrorMessages} from "../../../core/utils/error.utils";
import {Response} from 'express'
import {postsService} from "../../application/posts.service";

export async function deletePostHandler(
    req: RequestWithParams<{ id:string }>,
    res: Response,
) {
    const id = req.params.id;
    const post = await postsService.findByIdOrError(id);

    if(!post) {
        res
            .status(HttpStatus.NotFound)
            .send(createErrorMessages([{ field: 'blogId', message: 'Post not found' }]));
        return;
    }

    await postsService.delete(id)
    res.sendStatus(HttpStatus.NoContent);
}