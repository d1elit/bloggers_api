import {getUserList} from "./handlers/get-user-list.handler";
import {Router} from "express";
import {createUserHandler} from "./handlers/create-user.handler";


export const usersRouter = Router();

usersRouter.get('', getUserList)
usersRouter.post('',createUserHandler)