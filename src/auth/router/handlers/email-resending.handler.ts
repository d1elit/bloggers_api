import { RequestWithBody } from '../../../core/types/requestTypes';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { Response } from 'express';
import { authService } from '../../application/auth.service';
import { HttpStatus } from '../../../core/types/http-statuses';

export async function emailResendingHandler(
  req: RequestWithBody<{ email: string }>,
  res: Response,
) {
  try {
    await authService.emailResending(req.body.email);
    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
