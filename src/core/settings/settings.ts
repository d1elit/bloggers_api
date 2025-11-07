import dotenv from 'dotenv';
dotenv.config();

export const SETTINGS = {
  PORT: process.env.PORT || 5002,
  MONGO_URL:
    process.env.MONGO_URL! ||
    'mongodb+srv://dropdox12:12345@clusterbloggerapi.xhhtlgy.mongodb.net/',
  DB_NAME: process.env.DB_NAME || 'bloggersDB',
  AC_SECRET: process.env.AC_SECRET! || 'dfsfsdfsdfdsf',
  AC_TIME: +process.env.AC_TIME! || 10,
  RF_SECRET: process.env.RF_SECRET! || 'healthy',
  RF_TIME: +process.env.RF_TIME! || 20,
  EMAIL: 'dropdox12@gmail.com',
  EMAIL_PASS: 'gbjw pcdy yalr enkl',
};
