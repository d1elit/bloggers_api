import {Router} from "express";
import {getCommentHandler} from "./handlers/get-comment.handler";
import {deleteCommentHandler} from "./handlers/delete-comment.handler";
import {getCommentListHandler} from "./handlers/get-comment-list.handler";
import {updateCommentHandler} from "./handlers/update-comment.handler";


export  const commentsRouter = Router({});

commentsRouter
    .get('/:id', getCommentHandler)
    .delete('/:id', deleteCommentHandler)
    .get('', getCommentListHandler)
    .put('/:id', updateCommentHandler)