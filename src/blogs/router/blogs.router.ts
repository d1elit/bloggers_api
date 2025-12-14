import { RequestHandler, Router } from 'express';
import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { blogInputDtoValidation } from './middlewares/blog.input-dto.validation-middlewares';
import { superAdminGuardMiddleware } from '../../auth/guards/super-admin.guard-middleware';
import { blogsPostInputDtoValidation } from '../../posts/router/middleware/post.input-dto.validation-middlewares';
import { container } from '../../composition-root';
import { BlogsController } from './blogs.controller';
import { AccessOptionalMiddleware } from '../../comments/middlewares/accessOptional.middleware';

export const blogsRouter = Router({});
const blogsController = container.get(BlogsController);

blogsRouter
  .get('', blogsController.getBlogsList.bind(blogsController))
  .get(
    '/:id',
    idValidation,
    inputValidationResultMiddleware,
    blogsController.getBlog.bind(blogsController),
  )
  .get(
    '/:id/posts',
    idValidation,
    AccessOptionalMiddleware,
    inputValidationResultMiddleware,
    blogsController.getBlogsPostList.bind(
      blogsController,
    ) as unknown as RequestHandler<{ id: string }>,
  )
  .put(
    '/:id',
    superAdminGuardMiddleware,
    blogInputDtoValidation,
    inputValidationResultMiddleware,
    blogsController.updateBlog.bind(blogsController),
  )
  .delete(
    '/:id',
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    blogsController.deleteBlog.bind(blogsController),
  )
  .post(
    '/',
    superAdminGuardMiddleware,
    blogInputDtoValidation,
    inputValidationResultMiddleware,
    blogsController.createBlog.bind(blogsController),
  )
  .post(
    '/:id/posts',
    superAdminGuardMiddleware,
    blogsPostInputDtoValidation,
    inputValidationResultMiddleware,
    blogsController.createPostInBlog.bind(blogsController),
  );
