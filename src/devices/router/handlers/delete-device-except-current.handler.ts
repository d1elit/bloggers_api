import { errorsHandler } from '../../../core/errors/errors.handler';
import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { jwtDecode } from 'jwt-decode';
import { refreshTokenPayload } from '../../../auth/types/refreshTokenPayload';
import { deviceService } from '../../../composition-root';

export async function deleteDeviceExceptCurrentHandler(
  req: Request,
  res: Response,
) {
  try {
    const refreshToken = req.cookies.refreshToken;
    const { deviceId }: refreshTokenPayload = jwtDecode(refreshToken);
    await deviceService.deleteExceptCurrent(deviceId);
    res.status(HttpStatus.NoContent).send();
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
