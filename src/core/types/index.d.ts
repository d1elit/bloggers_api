import { idType } from '../../auth/types/userIdType';

declare global {
  namespace Express {
    export interface Request {
      user: userIdType | null;
    }
  }
}
