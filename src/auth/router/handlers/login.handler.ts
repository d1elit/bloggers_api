import { Response } from 'express';
import { RequestWithBody } from '../../../core/types/requestTypes';
import { LoginInput } from '../input/login.input';
import { HttpStatus } from '../../../core/types/http-statuses';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { authService } from '../../application/auth.service';
import {header} from "express-validator";

export async function loginHandler(
  req: RequestWithBody<LoginInput>,
  res: Response,
) {
  try {

    const deviceName = req.headers['user-agent']?.split('/')[0] || 'unknown device';
    const ip =  req.socket.remoteAddress || req.ip || 'unknown ip';



    const [accessToken, refreshToken] = await authService.auth({loginDto: req.body, ip, deviceName});

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    res.status(HttpStatus.Ok).send({ accessToken: accessToken });
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
