import { UserSession } from '../types/userSession';
import { sessionsCollection } from '../../db/mongo.db';

export const sessionsRepository = {
  async create(sessionDto: UserSession) {
    await sessionsCollection.insertOne(sessionDto);
  },

  async find(iat: string) {
    return sessionsCollection.findOne({ iat: iat });
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
};
