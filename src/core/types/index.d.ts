import { idType } from '../../auth/types/id';

declare global {
  namespace Express {
    export interface Request {
      user: idType | null;
    }
  }
}
