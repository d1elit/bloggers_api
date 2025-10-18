import {Request, Response} from "express";
import {errorsHandler} from "../../../core/errors/errors.handler";
import {HttpStatus} from "../../../core/types/http-statuses";
import {usersQueryRepository} from "../../../users/repositories/users.query-repository";

export async function getAuthMeHandler(
    req: Request,
    res: Response,
) {
    try {
        const userId = req.user?.id as string;
        if(!userId) return res.sendStatus(HttpStatus.Unauthorized);
        const me = await usersQueryRepository.findByIdOrError(userId);
        return res.status(HttpStatus.Ok).send(me)

    } catch (e: unknown) {
        errorsHandler(e, res)
    }
}