import { Response } from 'express';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { RequestWithBody } from '../../../core/types/requestTypes';
import { HttpStatus } from '../../../core/types/http-statuses';
import { authService } from '../../../composition-root';

export async function registrationConfirmationHandler(
  req: RequestWithBody<{ code: string }>,
  res: Response,
) {
  try {
    await authService.registrationConfirmation(req.body.code);
    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
