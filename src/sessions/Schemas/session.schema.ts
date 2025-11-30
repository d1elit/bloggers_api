import { HydratedDocument, model, Model } from 'mongoose';
import { UserSession } from '../types/userSession';
import mongoose from 'mongoose';

type SessionModel = Model<UserSession>;

export type SessionDocument = HydratedDocument<UserSession>;

export const SessionSchema = new mongoose.Schema<UserSession>({
  userId: { type: String, required: true },
  deviceId: { type: String, required: true },
  deviceName: { type: String, required: true },
  ip: { type: String, required: true },
  iat: { type: Number, required: true },
  exp: { type: Number, required: true },
});

export const SessionModel = model<UserSession, SessionModel>(
  'sessions',
  SessionSchema,
);
