import { sessionsRepository } from '../../sessions/repositories/sessionsRepository';
import { DeviceOutput } from '../router/output/device.output';
import { mapToDeviceList } from '../router/mappers/map-to-device-list';
import { RepositoryNotFoundError } from '../../core/errors/domain.errors';

export const devicesService = {
  async deleteDevice(deviceId: string): Promise<void> {
    const device = await sessionsRepository.findByDeviceId(deviceId);
    if (!device) throw new RepositoryNotFoundError('Device not found');
    await sessionsRepository.deleteByDevice(deviceId);
  },
  async deleteExceptCurrent(deviceId: string): Promise<void> {
    console.log('deviceId in DEVICES', deviceId);
    const device = await sessionsRepository.findByDeviceId(deviceId);
    if (!device) throw new RepositoryNotFoundError('Device not found');
    return sessionsRepository.deleteExceptCurrent(deviceId);
  },
  async getDeviceList(userId: string): Promise<DeviceOutput[]> {
    const sessions = await sessionsRepository.findAll(userId);
    return mapToDeviceList(sessions);
  },
};
