import { body } from 'express-validator';

const blogNameValidation = body('name')
  .isString()
  .withMessage('Name must be a string')
  .trim()
  .isLength({ min: 3, max: 15 })
  .withMessage('Length of name is not correct');

const blogDescriptionValidation = body('description')
  .isString()
  .withMessage('Description must be a string')
  .trim()
  .isLength({ min: 3, max: 500 })
  .withMessage('Length of description is not correct');

const blogUrlValidation = body('websiteUrl')
  .isString()
  .withMessage('websiteUrl must be a string')
  .trim()
  .isLength({ min: 3, max: 100 })
  .withMessage('Length of websiteUrl is not correct')
  .matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  )
  .withMessage('URL must match the right pattern');
const blogCreatedAtValidation = body('createdAt')
  .optional() // если поле необязательное при создании
  .isISO8601()
  .withMessage('createdAt must be a valid ISO 8601 date-time string');

export const blogInputDtoValidation = [
  blogNameValidation,
  blogDescriptionValidation,
  blogUrlValidation,
  blogCreatedAtValidation,
];
