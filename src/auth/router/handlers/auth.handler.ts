import { Response } from 'express';
import { RequestWithBody } from '../../../core/types/requestTypes';
import { Login } from '../../types/login';
import { HttpStatus } from '../../../core/types/http-statuses';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { authService } from '../../application/auth.service';

export async function authHandler(req: RequestWithBody<Login>, res: Response) {
  try {
    let token = await authService.auth(req.body);

    req.headers.authorization = `Bearer ${token}`;

    res.status(HttpStatus.Ok).send({ accessToken: token });
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
