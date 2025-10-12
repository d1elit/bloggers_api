import {Request,Response} from "express";
import {RequestWithBody} from "../../../core/types/requestTypes";
import {Login} from "../../types/login";
import {HttpStatus} from "../../../core/types/http-statuses";
import {errorsHandler} from "../../../core/errors/errors.handler";

// export function authHandler (
//     req: Request,
//     res: Response,
// ) {
//     return  {hi:"Hello"}
// }

export async function authHandler(
    req: RequestWithBody<Login>,
    res: Response,
) {
    try {
        // req.body = req.body;
        let result = req.body;
        // const createdBlog = await blogsService.create(req.body);
        // const blogViewModel: BlogOutput = mapToBlogViewModel(createdBlog);
        // res.status(HttpStatus.Created).send(blogViewModel);
        res.status(HttpStatus.Created).send(result);
    } catch (e: unknown) {
        // res.status(HttpStatus.Created).send(blogViewModel);
        // res.send(result)
        errorsHandler(e, res);
    }
}