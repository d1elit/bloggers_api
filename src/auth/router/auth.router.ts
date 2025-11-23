import { Router } from 'express';
import { loginInputDtoValidation } from '../middlewares/login.input-dto.validation-middlware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { AccsessTokenGuardMiddleware } from '../guards/accsess.token.guard-middleware';
import {
  confirmationInputDtoValidationMiddleware,
  emailInputDtoValidationMiddleware,
  newPasswordInputDtoValidationMiddleware,
  registrationInputDtoValidationMiddleware,
} from '../middlewares/registration.input-dto.validation-middleware';
import { refreshTokenGuardMiddleware } from '../guards/refresh.token.guard-middleware';
import rateLimit from 'express-rate-limit';
import { container } from '../../composition-root';
import { AuthController } from './auth.controller';

const authController = container.get(AuthController); // export const loginRateLimiter = rateLimit({

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
  authController.login.bind(authController),
);

authRouter.post(
  '/registration',
  // registerRateLimiter,
  registrationInputDtoValidationMiddleware,
  inputValidationResultMiddleware,
  authController.registration.bind(authController),
);

authRouter.post(
  '/registration-confirmation',
  // confirmationRateLimiter,
  confirmationInputDtoValidationMiddleware,
  inputValidationResultMiddleware,
  authController.registrationConfirmation.bind(authController),
);

authRouter.post(
  '/registration-email-resending',
  // emailRateLimiter,
  emailInputDtoValidationMiddleware,
  inputValidationResultMiddleware,
  authController.emailResending.bind(authController),
);

authRouter.get(
  '/me',
  AccsessTokenGuardMiddleware,
  authController.getAuthMe.bind(authController),
);
authRouter.post(
  '/refresh-token',
  refreshTokenGuardMiddleware,
  authController.refreshToken.bind(authController),
);
authRouter.post(
  '/logout',
  refreshTokenGuardMiddleware,
  authController.logout.bind(authController),
);

authRouter.post(
  '/password-recovery',
  passwordRecRateLimiter,
  emailInputDtoValidationMiddleware,
  inputValidationResultMiddleware,
  authController.passwordRecovery.bind(authController),
);
authRouter.post(
  '/new-password',
  newPasswordInputDtoValidationMiddleware,
  newPasswordRateLimiter,
  inputValidationResultMiddleware,
  authController.newPassword.bind(authController),
);
