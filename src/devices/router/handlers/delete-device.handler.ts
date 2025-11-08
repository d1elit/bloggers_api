import { errorsHandler } from '../../../core/errors/errors.handler';
import { Response } from 'express';
import { devicesService } from '../../application/devices.service';
import { HttpStatus } from '../../../core/types/http-statuses';
import { RequestWithParams } from '../../../core/types/requestTypes';

export async function deleteDeviceHandler(
  req: RequestWithParams<{ deviceId: string }>,
  res: Response,
) {
  try {
    const deviceId = req.params.deviceId;
    await devicesService.deleteDevice(deviceId);
    res.status(HttpStatus.NoContent).send();
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
