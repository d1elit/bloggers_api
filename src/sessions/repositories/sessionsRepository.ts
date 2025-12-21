import { injectable } from 'inversify';
import {
  SessionDocument,
  SessionEntity,
  SessionModel,
} from '../domain/sessionEntity';

@injectable()
export class SessionsRepository {
  async create(session: SessionEntity) {
    await SessionModel.create(session);
  }

  async find(iat: number, deviceId: string): Promise<SessionDocument | null> {
    return SessionModel.findOne({ iat: iat, deviceId: deviceId });
  }

  findByDeviceId(deviceId: string) {
    return SessionModel.findOne({ deviceId: deviceId });
  }

  async update(iat: number, exp: number, oldVersion: number) {
    console.log('iat in db:', iat, 'exp', exp);
    await SessionModel.updateOne(
      { iat: oldVersion },
      { $set: { iat: iat, exp: exp } },
    );
  }

  async delete(iat: number) {
    await SessionModel.deleteOne({ iat: iat });
  }

  async deleteByDevice(deviceId: string) {
    await SessionModel.deleteOne({ deviceId: deviceId });
  }

  async deleteExceptCurrent(deviceId: string) {
    await SessionModel.deleteMany({ deviceId: { $ne: deviceId } });
  }

  async findAll(userId: string) {
    return SessionModel.find({ userId: userId });
  }
}
