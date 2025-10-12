import {UserOutput} from "../router/output/user.output";
import {blogsCollection, usersCollection} from "../../db/mongo.db";
import {WithId} from "mongodb";
import {User} from "../types/user";

export const usersRepository = {
    async create (newUser: User): Promise<WithId<User>> {

        // usersCollection.insertOne(userDto)
        const insertResult = await usersCollection.insertOne(newUser);
        return { ...newUser, _id: insertResult.insertedId };

    }
}