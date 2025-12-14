import { Router } from 'express';
import { userInputDtoValidation } from './middlewares/user.input-dto.validation-middlewares';
import { superAdminGuardMiddleware } from '../../auth/guards/super-admin.guard-middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import { container } from '../../composition-root';
import { UsersController } from './users.controller';

const usersController = container.get(UsersController);

export const usersRouter = Router();

usersRouter.get('', usersController.getUserList.bind(usersController));
usersRouter.post(
  '',
  superAdminGuardMiddleware,
  userInputDtoValidation,
  inputValidationResultMiddleware,
  usersController.createUser.bind(usersController),
);
usersRouter.delete(
  '/:id',
  superAdminGuardMiddleware,
  idValidation,
  inputValidationResultMiddleware,
  usersController.deleteUser.bind(usersController),
);
