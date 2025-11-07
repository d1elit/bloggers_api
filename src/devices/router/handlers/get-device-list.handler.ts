import { Response, Request } from 'express';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { sessionsQueryRepository } from '../../../auth/repositories/sessionsQueryRepository';
import { HttpStatus } from '../../../core/types/http-statuses';

export async function getDeviceListHandler(req: Request, res: Response) {
  try {
    const userId = req.user?.userId as string;
    console.log('SCURE ID is :', userId);
    const sessions = await sessionsQueryRepository.findAll(userId);
    res.status(HttpStatus.Ok).send(sessions);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
