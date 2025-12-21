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

export type SessionDto = {
  userId: string;
  deviceId: string;
  deviceName: string;
  ip: string;
  iat: number;
  exp: number;
};

export class SessionEntity {
  userId!: string;
  deviceId!: string;
  deviceName!: string;
  ip!: string;
  iat!: number;
  exp!: number;

  static createNew(sessionDto: SessionDto) {
    const session = new SessionEntity();
    session.userId = sessionDto.userId;
    session.deviceId = sessionDto.deviceId;
    session.deviceName = sessionDto.deviceName;
    session.ip = sessionDto.ip;
    session.iat = sessionDto.iat;
    session.exp = sessionDto.exp;
    return session;
  }
}

export const SessionModel = model<UserSession, SessionModel>(
  'sessions',
  SessionSchema,
);
