import {SettingsType} from "../types/settings";

export const SETTINGS: SettingsType = {
  PORT: process.env.PORT || 5001,
  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017',
  DB_NAME: process.env.DB_NAME || 'learning',
  AC_SECRET: process.env.AC_SECRET || 'dfsfsdfsdfdsf',
  AC_TIME: process.env.AC_TIME || '1h',
};
