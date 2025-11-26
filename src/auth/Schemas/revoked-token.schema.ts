import { HydratedDocument, model, Model } from 'mongoose';
import { RevokedToken } from '../types/revokedTokens';
import mongoose from 'mongoose';

type RevokedTokenModel = Model<RevokedToken>;

export type RevokedTokenDocument = HydratedDocument<RevokedToken>;

export const RevokedTokenSchema = new mongoose.Schema<RevokedToken>({
  token: { type: String, required: true },
});

export const RevokedTokenModel = model<RevokedToken, RevokedTokenModel>(
  'revokedTokens',
  RevokedTokenSchema,
);
