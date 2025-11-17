import { Router } from 'express';
import { loginHandler } from './handlers/login.handler';
import { loginInputDtoValidation } from '../middlewares/login.input-dto.validation-middlware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { getAuthMeHandler } from './handlers/get-auth-me.handler';
import { AccsessTokenGuardMiddleware } from '../guards/accsess.token.guard-middleware';
import { registrationHandler } from './handlers/registration.handler';
import {
  confirmationInputDtoValidationMiddleware,
  emailInputDtoValidationMiddleware,
  newPasswordInputDtoValidationMiddleware,
  registrationInputDtoValidationMiddleware,
} from '../middlewares/registration.input-dto.validation-middleware';
import { registrationConfirmationHandler } from './handlers/registration-confirmation.handler';
import { emailResendingHandler } from './handlers/email-resending.handler';
import { refreshTokenGuardMiddleware } from '../guards/refresh.token.guard-middleware';
import { refreshTokenHandler } from './handlers/refresh-token.handler';
import { logoutHandler } from './handlers/logout.handler';
import { passwordRecoveryHandler } from './handlers/password-recovery.handler';
import { newPasswordHandler } from './handlers/new-password.handler';
import rateLimit from 'express-rate-limit'; // export const loginRateLimiter = rateLimit({

// export const loginRateLimiter = rateLimit({
//   windowMs: 10 * 1000, // 10 секунд
//   max: 5,
//   keyGenerator: (req) => `${req.ip}-login`,
//   skipSuccessfulRequests: false,
//
//   standardHeaders: true,
//   legacyHeaders: false,
// });
//
// export const registerRateLimiter = rateLimit({
//   windowMs: 10 * 1000, // 10 секунд
//   max: 5,
//   keyGenerator: (req) => `${req.ip}-login`,
//   skipSuccessfulRequests: false,
// });
//
// export const emailRateLimiter = rateLimit({
//   windowMs: 10 * 1000, // 10 секунд
//   max: 5,
//   keyGenerator: (req) => `${req.ip}-login`,
//   skipSuccessfulRequests: false,
//   standardHeaders: true,
//   legacyHeaders: false,
// });
//
// export const confirmationRateLimiter = rateLimit({
//   windowMs: 10 * 1000, // 10 секунд
//   max: 5,
//   keyGenerator: (req) => `${req.ip}-login`,
//   skipSuccessfulRequests: false,
// });

export const passwordRecRateLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 секунд
  max: 5,
  keyGenerator: (req) => `${req.ip}-login`,
  skipSuccessfulRequests: false,
});

export const newPasswordRateLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 секунд
  max: 5,
  keyGenerator: (req) => `${req.ip}-login`,
  skipSuccessfulRequests: false,
});

export const authRouter = Router();

authRouter.post(
  '/login',
  loginInputDtoValidation,
  // loginRateLimiter,
  inputValidationResultMiddleware,
  loginHandler,
);

authRouter.post(
  '/registration',
  // registerRateLimiter,
  registrationInputDtoValidationMiddleware,
  inputValidationResultMiddleware,
  registrationHandler,
);

authRouter.post(
  '/registration-confirmation',
  // confirmationRateLimiter,
  confirmationInputDtoValidationMiddleware,
  inputValidationResultMiddleware,
  registrationConfirmationHandler,
);

authRouter.post(
  '/registration-email-resending',
  // emailRateLimiter,
  emailInputDtoValidationMiddleware,
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

authRouter.post(
  '/password-recovery',
  passwordRecRateLimiter,
  emailInputDtoValidationMiddleware,
  inputValidationResultMiddleware,
  passwordRecoveryHandler,
);
authRouter.post(
  '/new-password',
  newPasswordInputDtoValidationMiddleware,
  newPasswordRateLimiter,
  inputValidationResultMiddleware,
  newPasswordHandler,
);
