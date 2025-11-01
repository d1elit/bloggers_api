export class RepositoryNotFoundError extends Error {
  constructor(
    detail: string,
    public readonly source?: string,
    public readonly code?: string,
  ) {
    super(detail);
  }
}
export class LoginError extends Error {
  constructor(
    detail: string,
    public readonly source?: string,
    public readonly code?: string,
  ) {
    super(detail);
  }
}
export class AccessError extends Error {
  constructor(
    detail: string,
    public readonly source?: string,
    public readonly code?: string,
  ) {
    super(detail);
  }
}
export class RegistrationConfirmationError extends Error {
  constructor(
    detail: string,
    public readonly source?: string,
    public readonly code?: string,
  ) {
    super(detail);
  }
}
export class DomainError extends Error {
  constructor(
    detail: string,
    public readonly source?: string,
    public readonly code?: string,
  ) {
    super(detail);
  }
}

export class UserCreationError extends Error {
  constructor(
    detail: string,
    public readonly source?: string,
    public readonly code?: string,
  ) {
    super(detail);
  }
}
