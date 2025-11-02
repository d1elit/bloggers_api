import { Response } from 'express';
import { RequestWithBody } from '../../../core/types/requestTypes';
import { LoginInput } from '../input/login.input';
import { HttpStatus } from '../../../core/types/http-statuses';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { authService } from '../../application/auth.service';

export async function loginHandler(
  req: RequestWithBody<LoginInput>,
  res: Response,
) {
  try {
    let [accessToken, refreshToken] = await authService.auth(req.body);

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    res.status(HttpStatus.Ok).send({ accessToken: accessToken });
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
