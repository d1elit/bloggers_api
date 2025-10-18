import {Commentator} from "../../types/commentator";

export type CommentOutput = {
    id: string;
    content: string;
    commentatorInfo:Commentator
    createdAt: string;
}

