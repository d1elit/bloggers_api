import {Response} from 'express';
import {errorsHandler} from "../../../core/errors/errors.handler";
import {usersQueryRepository} from "../../repositories/users.query-repository";
import {setDefaultSortAndPaginationIfNotExist} from "../../../core/helpers/set-default-query-params";
import {RequestWithQuery} from "../../../core/types/requestTypes";
import {UsersQueryInput} from "../input/user-query.input";
import {UsersPaginatedOutput} from "../output/users-paginated.output";



export async function getUserList(
    req: RequestWithQuery<UsersQueryInput>,
    res: Response<UsersPaginatedOutput>) {
    try {

        const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);

        let users = await usersQueryRepository.findAll(queryInput);
        res.status(200).send(users);
    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}