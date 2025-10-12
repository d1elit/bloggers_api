import { usersCollection} from "../../db/mongo.db";
import {ObjectId, WithId} from "mongodb";
import {User} from "../types/user";
import {RepositoryNotFoundError} from "../../core/errors/repostory-not-found.error";

export const usersRepository = {
    async create (newUser: User): Promise<WithId<User>> {
        const insertResult = await usersCollection.insertOne(newUser);
        return { ...newUser, _id: insertResult.insertedId };

    },


    async delete(id:string) {
        const deleteResult= await usersCollection.deleteOne({ _id: new ObjectId(id)})
        if (deleteResult.deletedCount < 1) {
            throw new RepositoryNotFoundError('user not exist');
        }
        return;
    }
}