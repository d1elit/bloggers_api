import { getDeviceListHandler } from './handlers/get-device-list.handler';
import { Router } from 'express';
import { AccsessTokenGuardMiddleware } from '../../auth/guards/accsess.token.guard-middleware';


export const devicesRouter = Router();

devicesRouter.get(
  '/devices',
  AccsessTokenGuardMiddleware,
  getDeviceListHandler,
);
