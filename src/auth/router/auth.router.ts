import { Router } from 'express';
import { authHandler } from './handlers/auth.handler';
import { authInputDtoValidation } from './auth.input-dto.validation-middlware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';

export const authRouter = Router();

authRouter.post(
  '/login',
  authInputDtoValidation,
  inputValidationResultMiddleware,
  authHandler,
);
