import {Request, Response} from 'express';
import {errorsHandler} from "../../../core/errors/errors.handler";
import {usersQueryRepository} from "../../repositories/users.query-repository";
import {User} from "../../types/user";


export async function getUserList(
    req: Request,
    res: Response) {
    try {
        let users = await usersQueryRepository.find();
        res.status(200).send(users);
    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}