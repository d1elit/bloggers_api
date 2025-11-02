import dotenv from 'dotenv';
dotenv.config();


export const SETTINGS = {
    PORT: process.env.PORT ,
    MONGO_URL: process.env.MONGO_URL! ,
    DB_NAME: process.env.DB_NAME ,
    AC_SECRET: process.env.AC_SECRET! ,
    AC_TIME: +process.env.AC_TIME! ,
    RF_SECRET: process.env.RF_SECRET! ,
    RF_TIME: +process.env.RF_TIME!,
    EMAIL: 'dropdox12@gmail.com',
    EMAIL_PASS: 'putu cqhi bajg pcqu',
};