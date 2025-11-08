import { UserSession } from '../types/userSession';
import { sessionsCollection } from '../../db/mongo.db';

export const sessionsRepository = {
  async create(sessionDto: UserSession) {
    await sessionsCollection.insertOne(sessionDto);
  },

  async find(iat: string) {
    return sessionsCollection.findOne({ iat: iat });
  },
  findByDeviceId(deviceId: string) {
    return sessionsCollection.findOne({ deviceId: deviceId });
  },

  async update(iat: string, exp: string, oldVersion: string) {
    console.log('iat in db:', iat, 'exp', exp);
    await sessionsCollection.updateOne(
      { iat: oldVersion },
      { $set: { iat: iat, exp: exp } },
    );
  },
  async delete(iat: string) {
    await sessionsCollection.deleteOne({ iat: iat });
  },
  async deleteByDevice(deviceId: string) {
    await sessionsCollection.deleteOne({ deviceId: deviceId });
  },

  async deleteExceptCurrent(deviceId: string) {
    await sessionsCollection.deleteMany({ deviceId: { $ne: deviceId } });
  },
  async findAll(userId: string) {
    const result = await sessionsCollection.find({ userId: userId }).toArray();
    return result;
    console.log(result);
  },
};
