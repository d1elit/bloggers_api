import { Router } from 'express';
import { loginHandler } from './handlers/login.handler';
import { loginInputDtoValidation } from './login.input-dto.validation-middlware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { getAuthMeHandler } from './handlers/get-auth-me.handler';
import { AccsessTokenGuardMiddleware } from '../middlewares/accsess.token.guard-middleware';
import { registrationHandler } from './handlers/registration.handler';
import {
  confirmationInputDtoValidationMiddleware,
  emailResendingInputDtoValidationMiddleware,
  registrationInputDtoValidationMiddleware,
} from './registration.input-dto.validation-middleware';
import { registrationConfirmationHandler } from './handlers/registration-confirmation.handler';
import { emailResendingHandler } from './handlers/email-resending.handler';
import { refreshTokenGuardMiddleware } from '../middlewares/refresh.token.guard-middleware';
import { refreshTokenHandler } from './handlers/refresh-token.handler';
import { logoutHandler } from './handlers/logout.handler';

export const authRouter = Router();

authRouter.post(
  '/login',
  loginInputDtoValidation,
  inputValidationResultMiddleware,
  loginHandler,
);

authRouter.post(
  '/registration',
  registrationInputDtoValidationMiddleware,
  inputValidationResultMiddleware,
  registrationHandler,
);

authRouter.post(
  '/registration-confirmation',
  confirmationInputDtoValidationMiddleware,
  inputValidationResultMiddleware,
  registrationConfirmationHandler,
);

authRouter.post(
  '/registration-email-resending',
  emailResendingInputDtoValidationMiddleware,
  inputValidationResultMiddleware,
  emailResendingHandler,
);

authRouter.get('/me', AccsessTokenGuardMiddleware, getAuthMeHandler);
authRouter.post(
  '/refresh-token',
  refreshTokenGuardMiddleware,
  refreshTokenHandler,
);
authRouter.post('/logout', refreshTokenGuardMiddleware, logoutHandler);
