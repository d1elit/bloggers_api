import {errorsHandler} from "../../../core/errors/errors.handler";
import {Request, Response} from "express";
import {commentsService} from "../../application/comments.service";
import {HttpStatus} from "../../../core/types/http-statuses";

export async function deleteCommentHandler(
    req: Request,
    res: Response,
) {
    try {
        await commentsService.delete(req.params.id);
        res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
        errorsHandler(e,res)
    }
}