import {body} from "express-validator";

const authLoginValidation = body('loginOrEmail')
    .isString()
    .withMessage('Login must be a string')
    .trim()
    .isLength({ min: 3, max: 15 })
    .withMessage('Length of login is not correct');

const AuthPassword = body('password')
    .isString()
    .withMessage('Password must be a string')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Length of password is not correct');


export const authInputDtoValidation = [
    authLoginValidation,
    AuthPassword,
];
