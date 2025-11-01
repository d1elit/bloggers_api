import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { authService } from '../../application/auth.service';
import { HttpStatus } from '../../../core/types/http-statuses';
export async function logoutHandler(req: Request, res: Response) {
  try {
    let token = req.cookies.refreshToken;
    await authService.logout(token);
    res.status(HttpStatus.NoContent).send();
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
