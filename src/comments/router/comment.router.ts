import { Router } from 'express';
import { getCommentHandler } from './handlers/get-comment.handler';
import { deleteCommentHandler } from './handlers/delete-comment.handler';
import { getCommentListHandler } from './handlers/get-comment-list.handler';
import { updateCommentHandler } from './handlers/update-comment.handler';
import { AccsessTokenGuardMiddleware } from '../../auth/middlewares/accsess.token.guard-middleware';
import { commentInputDtoValidation } from './comment.input-dto.validation-middleware';
import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';

export const commentsRouter = Router({});

commentsRouter
  .get('/:id', idValidation, inputValidationResultMiddleware, getCommentHandler)
  .delete(
    '/:id',
    idValidation,
    AccsessTokenGuardMiddleware,
    inputValidationResultMiddleware,
    deleteCommentHandler,
  )
  .get('', getCommentListHandler)
  .put(
    '/:id',
    AccsessTokenGuardMiddleware,
    commentInputDtoValidation,
    inputValidationResultMiddleware,
    updateCommentHandler,
  );
