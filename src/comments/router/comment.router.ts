import { Router } from 'express';
import { AccsessTokenGuardMiddleware } from '../../auth/guards/accsess.token.guard-middleware';
import { commentInputDtoValidation } from './comment.input-dto.validation-middleware';
import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { container } from '../../composition-root';
import { CommentsController } from './comments.controller';

const commentsController = container.get(CommentsController);

export const commentsRouter = Router({});

commentsRouter
  .get(
    '/:id',
    idValidation,
    inputValidationResultMiddleware,
    commentsController.getComment.bind(commentsController),
  )
  .delete(
    '/:id',
    idValidation,
    AccsessTokenGuardMiddleware,
    inputValidationResultMiddleware,
    commentsController.deleteComment.bind(commentsController),
  )
  .get('', commentsController.getCommentList.bind(commentsController))
  .put(
    '/:id',
    AccsessTokenGuardMiddleware,
    commentInputDtoValidation,
    inputValidationResultMiddleware,
    commentsController.updateComment.bind(commentsController),
  );
