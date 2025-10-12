import {usersCollection} from "../../db/mongo.db";
import {WithId} from "mongodb";
import {User} from "../types/user";
import {mapToUsers} from "../router/mappers/map-to-users-view-model";
import {UserOutput} from "../router/output/user.output";


export const usersQueryRepository = {
    async find() : Promise<UserOutput[]>  {
        let users = await usersCollection.find().toArray();
        return users.map(mapToUsers);
    }
}