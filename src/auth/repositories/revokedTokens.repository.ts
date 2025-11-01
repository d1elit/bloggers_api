import { WithId } from 'mongodb';
import { RevokedToken } from '../types/revokedTokens';
import { revokedTokensCollection } from '../../db/mongo.db';

export const revokedTokensRepository = {
  async find(token: string): Promise<WithId<RevokedToken> | null> {
    let refreshToken = await revokedTokensCollection.findOne({ token: token });
    console.log(`Token from  BLACK LIST: ${refreshToken}`);
    return refreshToken;
  },
  async insert(token: string) {
    await revokedTokensCollection.insertOne({ token: token });
  },
};
