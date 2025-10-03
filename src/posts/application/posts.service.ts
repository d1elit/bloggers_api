import {Post} from "../types/post";
import {PostInputModel} from "../models/postInputModel";
import {ObjectId, WithId} from "mongodb";
import {postsCollection, client, blogsCollection} from "../../db/mongo.db";
import {postsRepository} from "../repositories/posts.db-repository";

export const  postsService = {
    async findAll() : Promise<WithId<Post>[]> {
        return   postsRepository.findAll();

    },
    async findByIdOrError(id: string) : Promise<WithId<Post>> {
        return  postsRepository.findByIdOrError(id)
    },
    async create(dto: PostInputModel): Promise<WithId<Post>> {
        const blog = await blogsCollection.findOne({ _id: new ObjectId(dto.blogId)})

        if(!blog) {
            throw new Error(`Blog with id ${dto.blogId} not found!`);
        }

        const newPost: Post = {
            title: dto.title,
            shortDescription: dto.shortDescription,
            content: dto.content,
            blogId: dto.blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString(),
        }

        const insertResult = await postsCollection.insertOne(newPost);
        return {...newPost, _id: insertResult.insertedId};
    },
    async delete(id:string) : Promise<void> {
        await postsRepository.delete(id);
        return;
    },
    async update(id:string, dto: PostInputModel) : Promise<void>  {
      await postsRepository.update(id, dto);
        return;
    }
}
