import { Router } from 'express';
import { refreshTokenGuardMiddleware } from '../../auth/guards/refresh.token.guard-middleware';
import { container } from '../../composition-root';
import { DevicesController } from './devices.controller';

const devicesController = container.get(DevicesController);

export const devicesRouter = Router();

devicesRouter.get(
  '/devices',
  refreshTokenGuardMiddleware,
  devicesController.getDeviceList.bind(devicesController),
);
devicesRouter.delete(
  '/devices/:deviceId',
  refreshTokenGuardMiddleware,
  devicesController.deleteDevice.bind(devicesController),
);
devicesRouter.delete(
  '/devices',
  refreshTokenGuardMiddleware,
  devicesController.deleteDeviceExceptCurrent.bind(devicesController),
);
