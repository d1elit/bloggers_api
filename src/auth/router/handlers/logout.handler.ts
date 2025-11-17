import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { HttpStatus } from '../../../core/types/http-statuses';
import { authService } from '../../../composition-root';

export async function logoutHandler(req: Request, res: Response) {
  try {
    let token = req.cookies.refreshToken;
    await authService.logout(token);
    // res.cookie('refreshToken', null, { httpOnly: true, secure: true });
    res.status(HttpStatus.NoContent).send();
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
