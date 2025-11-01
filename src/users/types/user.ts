export type User = {
  login: string;
  password: string;
  email: string;
  createdAt: string;
  confirmationEmail: {
    confirmationCode: string;
    isConfirmed: boolean;
    expirationDate: string;
  };
};
