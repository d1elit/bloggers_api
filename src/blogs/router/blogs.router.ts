import { Router } from 'express';
import { getBlogsListHandler } from './handlers/get-blog-list.handler';
import { getBlogHandler } from './handlers/get-blog.handler';
import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { createBlogHandler } from './handlers/create-blog.handler';
import { blogInputDtoValidation } from '../validation/blog.input-dto.validation-middlewares';
import { deleteBlogHandler } from './handlers/delete-blog.handler';
import { updateBlogHandler } from './handlers/update-blog.handler';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';

export const blogsRouter = Router({});

blogsRouter
  .get('', getBlogsListHandler)
  .get('/:id', idValidation, inputValidationResultMiddleware, getBlogHandler)
  .put(
    '/:id',
    superAdminGuardMiddleware,
    blogInputDtoValidation,
    inputValidationResultMiddleware,
    updateBlogHandler,
  )
  .delete(
    '/:id',
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deleteBlogHandler,
  )
  .post(
    '/',
    superAdminGuardMiddleware,
    blogInputDtoValidation,
    inputValidationResultMiddleware,
    createBlogHandler,
  );
