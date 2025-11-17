import { RequestWithBody } from '../../../core/types/requestTypes';
import { UserInput } from '../input/user.input';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { Response } from 'express';
import { mapToUsers } from '../mappers/map-to-users-view-model';
import { HttpStatus } from '../../../core/types/http-statuses';
import { usersService } from '../../../composition-root';

export async function createUserHandler(
  req: RequestWithBody<UserInput>,
  res: Response,
) {
  try {
    let result = await usersService.create(req.body);
    let newUser = mapToUsers(result);
    console.log(newUser);
    res.status(HttpStatus.Created).send(newUser);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
