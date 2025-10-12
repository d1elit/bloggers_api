import { Response } from 'express';
import {
  LoginError,
  RepositoryNotFoundError,
} from './repostory-not-found.error';
import { HttpStatus } from '../types/http-statuses';
import { createErrorMessages } from '../middlewares/validation/input-validtion-result.middleware';
import { DomainError } from './domain.error';

export function errorsHandler(error: unknown, res: Response): void {
  console.error('[errorsHandler] called with:', error);
  if (error instanceof RepositoryNotFoundError) {
    const httpStatus = HttpStatus.NotFound;

    res.status(httpStatus).send(
      createErrorMessages([
        {
          status: httpStatus,
          detail: error.message,
        },
      ]),
    );

    return;
  }
  if (error instanceof LoginError) {
    const httpStatus = HttpStatus.Unauthorized;
    res.status(httpStatus).send(
      createErrorMessages([
        {
          status: httpStatus,
          detail: error.message,
        },
      ]),
    );
  }

  if (error instanceof DomainError) {
    const httpStatus = HttpStatus.UnprocessableEntity;

    res.status(httpStatus).send(
      createErrorMessages([
        {
          status: httpStatus,
          source: error.source,
          detail: error.message,
          code: error.code,
        },
      ]),
    );

    return;
  }

  res.status(HttpStatus.InternalServerError);
  return;
}
