import { body } from 'express-validator';

const userLoginValidation = body('login')
    .isString()
    .withMessage('login must be a string')
    .trim()
    .isLength({ min: 3, max: 15 })
    .withMessage('Length of login is not correct');

const userEmailValidation = body('email')
    .isString()
    .withMessage('email must be a string')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Length of email is not correct')
    .isEmail()
    .withMessage('Email in wrong format');
const userCreatedAtValidation = body('createdAt')
    .optional() // если поле необязательное при создании
    .isISO8601()
    .withMessage('createdAt must be a valid ISO 8601 date-time string');

export const userInputDtoValidation = [
    userLoginValidation,
    userEmailValidation,
    userCreatedAtValidation
];
