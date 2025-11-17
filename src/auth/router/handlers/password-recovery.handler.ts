import { errorsHandler } from '../../../core/errors/errors.handler';
import { Response } from 'express';
import { RequestWithBody } from '../../../core/types/requestTypes';
import { HttpStatus } from '../../../core/types/http-statuses';
import { authService } from '../../../composition-root';

export async function passwordRecoveryHandler(
  req: RequestWithBody<{ email: string }>,
  res: Response,
) {
  try {
    let result = await authService.passwordRecovery(req.body.email);
    res.status(HttpStatus.NoContent).send(result);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
