import { UserSession } from '../../../sessions/types/userSession';
import { DeviceOutput } from '../output/device.output';

export function mapToDeviceList(sessions: UserSession[]): DeviceOutput[] {
  return sessions.map((session) => {
    return {
      ip: session.ip,
      title: session.deviceName,
      lastActiveDate: session.iat,
      deviceId: session.deviceId,
    };
  });
}
