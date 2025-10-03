export type ErroreType = {
  errorsMessages: ValidationError[];
};

export type ValidationError = {
  field: string;
  message: string;
};
