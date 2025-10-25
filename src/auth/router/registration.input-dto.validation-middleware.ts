import { body } from 'express-validator';

const regLogin = body('login')
    .isString()
    .withMessage('Login must be a string')
    .trim()
    .isLength({ min: 3, max: 10 })
    .withMessage('Length of login is not correct')
    .matches(/^[a-zA-Z0-9_-]*$/)

const regPassword = body('password')
    .isString()
    .withMessage('Password must be a string')
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage('Length of password is not correct');

const regEmail = body('email')
    .isString()
    .withMessage('email must be a string')
    .trim()
    .withMessage('Length of login is not correct')
    .isEmail()
    .withMessage('This string is not Email')

export const registrationInputDtoValidationMiddleware = [regLogin, regPassword, regEmail];
export const emailResendingInputDtoValidationMiddleware = [regEmail];