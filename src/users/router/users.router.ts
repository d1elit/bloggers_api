import {getUserList} from "./handlers/get-user-list.handler";
import {Router} from "express";


export const usersRouter = Router();

usersRouter.get('', getUserList)