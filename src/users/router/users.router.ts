import { getUserList } from './handlers/get-user-list.handler';
import { Router } from 'express';
import { createUserHandler } from './handlers/create-user.handler';
import { deleteUserHandler } from './handlers/delete-user.handler';
import { userInputDtoValidation } from './user.input-dto.validation-middlewares';
import { superAdminGuardMiddleware } from '../../auth/guards/super-admin.guard-middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';

export const usersRouter = Router();

usersRouter.get('', getUserList);
usersRouter.post(
  '',
  superAdminGuardMiddleware,
  userInputDtoValidation,
  inputValidationResultMiddleware,
  createUserHandler,
);
usersRouter.delete(
  '/:id',
  superAdminGuardMiddleware,
  idValidation,
  inputValidationResultMiddleware,
  deleteUserHandler,
);
