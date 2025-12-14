import { UserOutput } from '../output/user.output';
import { UserDocument } from '../../../domain/userEntity';

export function mapToUsers(users: UserDocument): UserOutput {
  return {
    id: users._id.toString(),
    login: users.login,
    email: users.email,
    createdAt: users.createdAt,
  };
}
