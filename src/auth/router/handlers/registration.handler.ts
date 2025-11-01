import { errorsHandler } from '../../../core/errors/errors.handler';
import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { authService } from '../../application/auth.service';

export async function registrationHandler(req: Request, res: Response) {
  try {
    let result = await authService.register(req.body);
    res.status(HttpStatus.NoContent).send(result);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
