import { body } from 'express-validator';

const authLoginValidation = body('loginOrEmail')
  .isString()
  .withMessage('LoginInput must be a string')
  .trim()
  .isLength({ min: 3, max: 25 })
  .withMessage('Length of login is not correct');

const AuthPassword = body('password')
  .isString()
  .withMessage('Password must be a string')
  .trim()
  .isLength({ min: 3, max: 100 })
  .withMessage('Length of password is not correct');

export const loginInputDtoValidation = [authLoginValidation, AuthPassword];
