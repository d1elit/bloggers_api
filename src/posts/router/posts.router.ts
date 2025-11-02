import { Router } from 'express';
import { getPostListHandler } from './handlers/get-post-list.handler';
import { getPostHandler } from './handlers/get-post.handler';
import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { createPostHandler } from './handlers/create-post.handler';
import { deletePostHandler } from './handlers/delete-post.handler';
import { postInputDtoValidation } from './post.input-dto.validation-middlewares';
import { updatePostHandler } from './handlers/update-post.handler';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';
import { createPostsCommentHandler } from './handlers/create-posts-comment.handler';
import { AccsessTokenGuardMiddleware } from '../../auth/middlewares/accsess.token.guard-middleware';
import { getPostsCommentListHandler } from './handlers/get-posts-comment-list.handler';
import { commentInputDtoValidation } from '../../comments/router/comment.input-dto.validation-middleware';

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
  )
  .post(
    '/:id/comments',
    AccsessTokenGuardMiddleware,
    commentInputDtoValidation,
    inputValidationResultMiddleware,
    createPostsCommentHandler,
  )
  .get('/:id/comments', getPostsCommentListHandler);
