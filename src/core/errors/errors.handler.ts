import { Response } from 'express';
import {
  AccessError,
  LoginError,
  RegistrationConfirmationError,
  RepositoryNotFoundError,
  DomainError,
  UserCreationError,
} from './domain.errors';
import { HttpStatus } from '../types/http-statuses';
import { createErrorMessages } from '../middlewares/validation/input-validtion-result.middleware';

export function errorsHandler(error: unknown, res: Response): void {
  // console.error('[errorsHandler] called with:', error);
  if (error instanceof RepositoryNotFoundError) {
    const httpStatus = HttpStatus.NotFound;

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
  if (error instanceof AccessError) {
    const httpStatus = HttpStatus.Forbidden;
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
  }
  if (error instanceof LoginError) {
    const httpStatus = HttpStatus.Unauthorized;
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
  }
  if (error instanceof UserCreationError) {
    const httpStatus = HttpStatus.BadRequest;
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
  }

  if (error instanceof RegistrationConfirmationError) {
    const httpStatus = HttpStatus.BadRequest;
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
