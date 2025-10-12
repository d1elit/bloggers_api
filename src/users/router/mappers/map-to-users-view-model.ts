import {WithId} from "mongodb";
import {User} from "../../types/user";
import {UserOutput} from "../output/user.output";

export function mapToUsers(users: WithId<User>) : UserOutput {
    return {
        id: users._id.toString(),
        login:users.login,
        email:users.email,
        createdAt: users.createdAt
    }
}