type ValidationError = {
  field: string;
  message: string;
};
export type ValidationErrorListOutput = { errorsMessages: ValidationError[] };
