import { Router } from 'express';
import { getPostListHandler } from './handlers/get-post-list.handler';
import { getPostHandler } from './handlers/get-post.handler';
import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { createPostHandler } from './handlers/create-post.handler';
import { deletePostHandler } from './handlers/delete-post.handler';
import { postInputDtoValidation } from '../validation/post.input-dto.validation-middlewares';
import { updatePostHandler } from './handlers/update-post.handler';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';

export const postsRouter = Router({});

postsRouter
  .get('', getPostListHandler)
  .get('/:id', idValidation, inputValidationResultMiddleware, getPostHandler)
  .put(
    '/:id',
    superAdminGuardMiddleware,
    postInputDtoValidation,
    inputValidationResultMiddleware,
    updatePostHandler,
  )
  .delete(
    '/:id',
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deletePostHandler,
  )
  .post(
    '/',
    superAdminGuardMiddleware,
    postInputDtoValidation,
    inputValidationResultMiddleware,
    createPostHandler,
  );
