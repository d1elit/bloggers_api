import { RequestHandler, Router } from 'express';
import { getBlogsListHandler } from './handlers/get-blog-list.handler';
import { getBlogHandler } from './handlers/get-blog.handler';
import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { createBlogHandler } from './handlers/create-blog.handler';
import { blogInputDtoValidation } from './blog.input-dto.validation-middlewares';
import { deleteBlogHandler } from './handlers/delete-blog.handler';
import { updateBlogHandler } from './handlers/update-blog.handler';
import { superAdminGuardMiddleware } from '../../auth/guards/super-admin.guard-middleware';
import { getBlogsPostList } from './handlers/get-blogs-post-list';
import { createBlogsPostHandler } from './handlers/create-post-in-blog.handler';
import { blogsPostInputDtoValidation } from '../../posts/router/post.input-dto.validation-middlewares';

export const blogsRouter = Router({});

blogsRouter
  .get('', getBlogsListHandler)
  .get('/:id', idValidation, inputValidationResultMiddleware, getBlogHandler)
  .get(
    '/:id/posts',
    idValidation,
    inputValidationResultMiddleware,
    getBlogsPostList as unknown as RequestHandler<{ id: string }>,
  )
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
  )
  .post(
    '/:id/posts',
    superAdminGuardMiddleware,
    blogsPostInputDtoValidation,
    inputValidationResultMiddleware,
    createBlogsPostHandler,
  );
