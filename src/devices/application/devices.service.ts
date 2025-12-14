import { SessionsRepository } from '../../sessions/repositories/sessionsRepository';
import { DeviceOutput } from '../router/dto/output/device.output';
import { mapToDeviceList } from '../router/dto/mappers/map-to-device-list';
import {
  AccessError,
  RepositoryNotFoundError,
} from '../../core/errors/domain.errors';
import { injectable } from 'inversify';

@injectable()
export class DevicesService {
  constructor(public readonly sessionsRepository: SessionsRepository) {}

  async deleteDevice(deviceId: string, userId: string): Promise<void> {
    const session = await this.sessionsRepository.findByDeviceId(deviceId);
    if (!session) throw new RepositoryNotFoundError('Device not found');
    if (session.userId !== userId) throw new AccessError('Forbidden');
    await this.sessionsRepository.deleteByDevice(deviceId);
  }

  async deleteExceptCurrent(deviceId: string): Promise<void> {
    // console.log('deviceId in DEVICES', deviceId);
    const device = await this.sessionsRepository.findByDeviceId(deviceId);
    if (!device) throw new RepositoryNotFoundError('Device not found');
    return this.sessionsRepository.deleteExceptCurrent(deviceId);
  }

  async getDeviceList(userId: string): Promise<DeviceOutput[]> {
    const sessions = await this.sessionsRepository.findAll(userId);
    return mapToDeviceList(sessions);
  }
}
