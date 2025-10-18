import {errorsHandler} from "../../../core/errors/errors.handler";
import { Response, Request } from 'express';
import {setDefaultSortAndPaginationIfNotExist} from "../../../core/helpers/set-default-query-params";
import {RequestWithParamsAndQuery, RequestWithQuery} from "../../../core/types/requestTypes";
import {CommentQueryInput} from "../../../comments/router/input/comment-query.input";
import {commentsQueryRepository} from "../../../comments/repositories/comments.query-repository";
import {HttpStatus} from "../../../core/types/http-statuses";


export async function getPostsCommentListHandler(
    req: RequestWithParamsAndQuery<{id:string}, CommentQueryInput>,
    res: Response,
) {
    try {

        const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);
        const comments = await commentsQueryRepository.findAll(queryInput,req.params.id);
        res.status(HttpStatus.Ok).send(comments);
    } catch (e:unknown) {
        errorsHandler(e, res)
    }
}