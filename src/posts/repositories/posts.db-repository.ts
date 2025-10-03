import {Post} from "../types/post";
import {PostInputModel} from "../models/postInputModel";
import {ObjectId, WithId} from "mongodb";
import {postsCollection, client, blogsCollection} from "../../db/mongo.db";
import {PostViewModel} from "../models/postViewModel";
import {RepositoryNotFoundError} from "../../core/errors/repostory-not-found.error";

export const postsRepository = {
    async findAll() : Promise<WithId<Post>[]> {
        return postsCollection.find({}).toArray();

    },
    async findByIdOrError(id: string) : Promise<WithId<Post>> {
        const res = await  postsCollection.findOne({ _id: new ObjectId(id)})
        if(!res) {
            throw new RepositoryNotFoundError('Post not found');
        }
        return res
    },
    async create(newPost: Post, id:string): Promise<WithId<Post>> {
        const insertResult = await postsCollection.insertOne(newPost);
        return {...newPost, _id: insertResult.insertedId};
    },
    async delete(id:string) : Promise<void> {
        const res = await  postsCollection.findOne({ _id: new ObjectId(id)})
        if(!res) {
            throw new RepositoryNotFoundError('Post not found');
        }
        await postsCollection.deleteOne({_id: new ObjectId(id)});
        return;
    },
    async update(id:string, dto: PostInputModel) : Promise<void>  {
        const res = await  postsCollection.findOne({ _id: new ObjectId(id)})
        if(!res) {
            throw new RepositoryNotFoundError('Post not found');
        }
        await postsCollection.updateOne({_id: new ObjectId(id)}, {$set: dto});
        return;
    }
}
