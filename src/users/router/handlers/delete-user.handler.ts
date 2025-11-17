import { errorsHandler } from '../../../core/errors/errors.handler';
import { RequestWithParams } from '../../../core/types/requestTypes';
import { Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { usersService } from '../../../composition-root';

export async function deleteUserHandler(
  req: RequestWithParams<{ id: string }>,
  res: Response,
) {
  try {
    await usersService.delete(req.params.id);
    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
