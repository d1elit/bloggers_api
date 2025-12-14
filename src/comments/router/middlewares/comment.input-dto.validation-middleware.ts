import { body } from 'express-validator';

const commentsContent = body('content')
  .isString()
  .withMessage('content must be a string')
  .trim()
  .isLength({ min: 20, max: 300 })
  .withMessage('Length of content is not correct');

const commentLike = body('likeStatus')
  .isString()
  .withMessage('likeStatus must be a string')
  .isIn(['None', 'Like', 'Dislike'])
  .withMessage('likeStatus must be None, Like or Dislike');

export const commentInputDtoValidation = [commentsContent];

export const likeInputDtoValidation = [commentLike];
