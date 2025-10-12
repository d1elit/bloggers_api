import {RequestWithBody} from "../../../core/types/requestTypes";
import {UserInput} from "../input/user.input";
import {errorsHandler} from "../../../core/errors/errors.handler";
import {Response} from "express";
import {usersService} from "../../application/users.service";
import {mapToUsers} from "../mappers/map-to-users-view-model";

export async function createUserHandler(
    req: RequestWithBody<UserInput>,
    res: Response,
) {
    try {
        let result = await usersService.create(req.body);
        let newUser = mapToUsers(result)
        res.status(201).send(newUser);
    } catch (e: unknown) {
        errorsHandler(e, res)
    }
}