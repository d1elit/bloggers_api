import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { authService } from '../../application/auth.service';
import { HttpStatus } from '../../../core/types/http-statuses';

export async function refreshTokenHandler(req: Request, res: Response) {
  try {

    const {userId, deviceId} = req.user!
    console.log('REFRESH USER ID', userId);
    const token = req.cookies.refreshToken;
    console.log('REFRESH TOKEN', token);
    const [accessToken, refreshToken] = await authService.refreshToken(
      token,
      userId,
      deviceId
    );
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    res.status(HttpStatus.Ok).send({ accessToken: accessToken });
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
