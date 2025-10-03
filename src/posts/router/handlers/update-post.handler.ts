import {RequestWithParamsAndBody} from "../../../core/types/requestTypes";
import {Response} from "express";
import {HttpStatus} from "../../../core/types/http-statuses";
import {createErrorMessages} from "../../../core/middlewares/validation/input-validtion-result.middleware";
import {PostInputModel} from "../../models/postInputModel";
import {postsService} from "../../application/posts.service";


export async function updatePostHandler(
    req: RequestWithParamsAndBody<{ id:string }, PostInputModel>,
    res: Response,
) {

    const id = req.params.id;
    const post = await postsService.findByIdOrError(id);
    if (!post) {
        res
            .status(HttpStatus.NotFound)
            .send(createErrorMessages([{message:'post not found', field:'id'}]));
    }

    await postsService.update(id, req.body);
    res.sendStatus(HttpStatus.NoContent);
}