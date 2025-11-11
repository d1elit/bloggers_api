import { sessionsRepository } from '../../sessions/repositories/sessionsRepository';
import { DeviceOutput } from '../router/output/device.output';
import { mapToDeviceList } from '../router/mappers/map-to-device-list';
import {
  AccessError,
  RepositoryNotFoundError,
} from '../../core/errors/domain.errors';

export const devicesService = {
  async deleteDevice(deviceId: string, userId: string): Promise<void> {
    const session = await sessionsRepository.findByDeviceId(deviceId);
    if (!session) throw new RepositoryNotFoundError('Device not found');
    if (session.userId !== userId) throw new AccessError('Forbidden');
    await sessionsRepository.deleteByDevice(deviceId);
  },
  async deleteExceptCurrent(deviceId: string): Promise<void> {
    // console.log('deviceId in DEVICES', deviceId);
    const device = await sessionsRepository.findByDeviceId(deviceId);
    if (!device) throw new RepositoryNotFoundError('Device not found');
    return sessionsRepository.deleteExceptCurrent(deviceId);
  },
  async getDeviceList(userId: string): Promise<DeviceOutput[]> {
    const sessions = await sessionsRepository.findAll(userId);
    return mapToDeviceList(sessions);
  },
};
