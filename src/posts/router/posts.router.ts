import { Router } from 'express';
import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { postInputDtoValidation } from './middleware/post.input-dto.validation-middlewares';
import { superAdminGuardMiddleware } from '../../auth/guards/super-admin.guard-middleware';
import { AccsessTokenGuardMiddleware } from '../../auth/guards/accsess.token.guard-middleware';
import {
  commentInputDtoValidation,
  likeInputDtoValidation,
} from '../../comments/router/comment.input-dto.validation-middleware';
import { container } from '../../composition-root';
import { PostsController } from './posts.controller';
import { AccessOptionalMiddleware } from '../../comments/middlewares/accessOptional.middleware';

const postsController = container.get(PostsController);

export const postsRouter = Router({});

// @ts-ignore
postsRouter
  .get(
    '',
    AccessOptionalMiddleware,
    // @ts-ignore
    postsController.getPostList.bind(postsController),
  )
  .get(
    '/:id',
    idValidation,
    AccessOptionalMiddleware,
    inputValidationResultMiddleware,
    postsController.getPost.bind(postsController),
  )
  .put(
    '/:id',
    superAdminGuardMiddleware,
    postInputDtoValidation,
    inputValidationResultMiddleware,
    postsController.updatePost.bind(postsController),
  )
  .delete(
    '/:id',
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    postsController.deletePost.bind(postsController),
  )
  .post(
    '/',
    superAdminGuardMiddleware,
    postInputDtoValidation,
    inputValidationResultMiddleware,
    postsController.createPost.bind(postsController),
  )
  .post(
    '/:id/comments',
    AccsessTokenGuardMiddleware,
    commentInputDtoValidation,
    inputValidationResultMiddleware,
    postsController.createPostsComment.bind(postsController),
  )
  .get(
    '/:id/comments',
    AccessOptionalMiddleware,
    // @ts-ignore
    postsController.getPostsCommentList.bind(postsController),
  )
  .put(
    '/:id/like-status',
    likeInputDtoValidation,
    AccsessTokenGuardMiddleware,
    inputValidationResultMiddleware,
    // @ts-ignore
    postsController.postLike.bind(postsController),
  );
