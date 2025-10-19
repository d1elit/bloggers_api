import { body } from 'express-validator';


const commentsContent = body('content')
    .isString()
    .withMessage('content must be a string')
    .trim()
    .isLength({ min: 20, max: 300 })
    .withMessage('Length of content is not correct');

export const commentInputDtoValidation = [
    commentsContent,
];
