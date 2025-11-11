import { getDeviceListHandler } from './handlers/get-device-list.handler';
import { Router } from 'express';
import { deleteDeviceHandler } from './handlers/delete-device.handler';
import { deleteDeviceExceptCurrentHandler } from './handlers/delete-device-except-current.handler';
import { refreshTokenGuardMiddleware } from '../../auth/guards/refresh.token.guard-middleware';

export const devicesRouter = Router();

devicesRouter.get(
  '/devices',
  refreshTokenGuardMiddleware,
  getDeviceListHandler,
);
devicesRouter.delete(
  '/devices/:deviceId',
  refreshTokenGuardMiddleware,
  deleteDeviceHandler,
);
devicesRouter.delete(
  '/devices',
  refreshTokenGuardMiddleware,
  deleteDeviceExceptCurrentHandler,
);
