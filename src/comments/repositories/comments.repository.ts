import {blogsCollection, commentsCollection} from "../../db/mongo.db";
import {Comment} from "../types/comment";
import {mapToCommentViewModel} from "../router/mappers/map-to-comment-view-model";
import {CommentOutput} from "../router/output/comment.output";
import {ObjectId, WithId} from "mongodb";
import {RepositoryNotFoundError} from "../../core/errors/repostory-not-found.error";
import {CommentInput} from "../router/input/comment.input";

export const commentsRepository = {
    async create(newComment : Comment) : Promise<string> {
        const insertResult = await commentsCollection.insertOne(newComment);
        return  insertResult.insertedId.toString()

    },
    async delete(id: string) : Promise<void> {
        let deleteResult = await commentsCollection.deleteOne({_id: new ObjectId(id)});
        if (deleteResult.deletedCount < 1) {
            throw new RepositoryNotFoundError('Comment not exist');
        }
        return;
    },
    async findByIdOrError(id: string): Promise<Comment>  {
        const result = await commentsCollection.findOne({_id: new ObjectId(id)})
        if(!result) {
            throw new RepositoryNotFoundError('Comment not found');
        }
        return result
    },

    async update(id: string, dto: CommentInput)   {
        const res = await commentsCollection.findOne({ _id: new ObjectId(id) });
        if (!res) {
            throw new RepositoryNotFoundError('comment not exist');
        }
        await commentsCollection.updateOne({ _id: new ObjectId(id) }, { $set: dto });
        return;
    }
}