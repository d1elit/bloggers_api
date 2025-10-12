import { body } from 'express-validator';

const userLoginValidation = body('login')
    .isString()
    .withMessage('login must be a string')
    .trim()
    .isLength({ min: 3, max: 10 })
    .withMessage('Length of login is not correct')
    .matches(
    /^[a-zA-Z0-9_-]*$/,
)

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

const passwordValidation = body('password')
    .isString()
    .withMessage('password must be a string')
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage('Length of password is not correct')

export const userInputDtoValidation = [
    userLoginValidation,
    userEmailValidation,
    userCreatedAtValidation,
    passwordValidation
];
