import {CommentInput} from "../router/input/comment.input";
import {commentsRepository} from "../repositories/comments.repository";
import {Comment} from "../types/comment";
import {commentsCollection} from "../../db/mongo.db";

export const commentsService = {
    async delete(id: string): Promise<void> {
        return await commentsRepository.delete(id);
    },
    async update(id:string, commentDto: CommentInput) {
        // const updatedComment: Comment = {
        //     content: commentDto.content,
        //     createdAt
        // }
        await commentsRepository.update(id, commentDto)
        return
    },

}