import { Request, Response } from 'express';
import { injectable } from 'inversify';
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithQuery,
} from '../../core/types/requestTypes';
import { HttpStatus } from '../../core/types/http-statuses';
import { errorsHandler } from '../../core/errors/errors.handler';
import { UsersService } from '../application/users.service';
import { UsersQueryRepository } from '../repositories/users.query-repository';
import { UserInput } from './input/user.input';
import { mapToUsers } from './mappers/map-to-users-view-model';
import { setDefaultSortAndPaginationIfNotExist } from '../../core/helpers/set-default-query-params';
import { UsersQueryInput } from './input/user-query.input';
import { UsersPaginatedOutput } from './output/users-paginated.output';

@injectable()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  async createUser(req: RequestWithBody<UserInput>, res: Response) {
    try {
      const result = await this.usersService.create(req.body);
      const newUser = mapToUsers(result);
      res.status(HttpStatus.Created).send(newUser);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async deleteUser(req: RequestWithParams<{ id: string }>, res: Response) {
    try {
      await this.usersService.delete(req.params.id);
      res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async getUserList(
    req: RequestWithQuery<UsersQueryInput>,
    res: Response<UsersPaginatedOutput>,
  ) {
    try {
      const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);
      const users = await this.usersQueryRepository.findAll(queryInput);
      res.status(HttpStatus.Ok).send(users);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }
}
