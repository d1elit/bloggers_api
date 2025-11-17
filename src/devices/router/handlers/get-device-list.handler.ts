import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { HttpStatus } from '../../../core/types/http-statuses';
import { deviceService } from '../../../composition-root';

export async function getDeviceListHandler(req: Request, res: Response) {
  try {
    const userId = req.user?.userId as string;
    const deviceList = await deviceService.getDeviceList(userId);
    res.status(HttpStatus.Ok).send(deviceList);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
