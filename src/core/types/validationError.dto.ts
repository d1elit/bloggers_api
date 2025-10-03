import { ValidationErrorType } from './validationError';
import { HttpStatus } from './http-statuses';

type ValidationError = {
  field: string;
  message: string;
};

// type ValidationErrorOutput = {
//     status: HttpStatus;
//     detail: string;
//     source: { pointer: string };
//     code: string | null;
// };

export type ValidationErrorListOutput = { errors: ValidationError[] };
