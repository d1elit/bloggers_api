import { getDeviceListHandler } from './handlers/get-device-list.handler';
import { Router } from 'express';
import { AccsessTokenGuardMiddleware } from '../../auth/guards/accsess.token.guard-middleware';
import { deleteDeviceHandler } from './handlers/delete-device.handler';
import { deleteDeviceExceptCurrentHandler } from './handlers/delete-device-except-current.handler';

export const devicesRouter = Router();

devicesRouter.get(
  '/devices',
  AccsessTokenGuardMiddleware,
  getDeviceListHandler,
);
devicesRouter.delete(
  '/devices/:deviceId',
  AccsessTokenGuardMiddleware,
  deleteDeviceHandler,
);
devicesRouter.delete(
  '/devices/',
  AccsessTokenGuardMiddleware,
  deleteDeviceExceptCurrentHandler,
);
