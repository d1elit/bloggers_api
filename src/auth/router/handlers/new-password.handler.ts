import { errorsHandler } from '../../../core/errors/errors.handler';
import { Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { authService } from '../../application/auth.service';
import { RequestWithBody } from '../../../core/types/requestTypes';

export async function newPasswordHandler(
  req: RequestWithBody<{ recoveryCode: string; newPassword: string }>,
  res: Response,
) {
  try {
    const code = req.body.recoveryCode;
    const password = req.body.newPassword;
    console.log(code, password);
    await authService.passwordRecoveryConfirmation({
      code,
      password,
    });
    res.status(HttpStatus.NoContent).send();
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
