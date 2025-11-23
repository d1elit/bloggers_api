import { Request, Response } from 'express';
import { injectable } from 'inversify';
import { RequestWithParams } from '../../core/types/requestTypes';
import { HttpStatus } from '../../core/types/http-statuses';
import { errorsHandler } from '../../core/errors/errors.handler';
import { DevicesService } from '../application/devices.service';
import { jwtDecode } from 'jwt-decode';
import { refreshTokenPayload } from '../../auth/types/refreshTokenPayload';

@injectable()
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  async deleteDeviceExceptCurrent(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;
      const { deviceId }: refreshTokenPayload = jwtDecode(refreshToken);
      await this.devicesService.deleteExceptCurrent(deviceId);
      res.status(HttpStatus.NoContent).send();
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async deleteDevice(
    req: RequestWithParams<{ deviceId: string }>,
    res: Response,
  ) {
    try {
      const deviceId = req.params.deviceId;
      const userId = req.user.userId;
      await this.devicesService.deleteDevice(deviceId, userId);
      res.status(HttpStatus.NoContent).send();
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async getDeviceList(req: Request, res: Response) {
    try {
      const userId = req.user?.userId as string;
      const deviceList = await this.devicesService.getDeviceList(userId);
      res.status(HttpStatus.Ok).send(deviceList);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }
}
