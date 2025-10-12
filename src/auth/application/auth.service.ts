import {usersQueryRepository} from "../../users/repositories/users.query-repository";
import {Login} from "../types/login";
import {LoginError} from "../../core/errors/repostory-not-found.error";
import {User} from "../../users/types/user";

export const authService = {
    async auth(loginDto: Login) {
        let user = await this.findUserByLoginOrEmail(loginDto.loginOrEmail)
        let isPasswordVerified = await this.verifyPasswords(loginDto.password, user.password)

        if (!user || !isPasswordVerified) {
            throw new LoginError('Wrong login or password');
        }
        return
    },

    async findUserByLoginOrEmail(login:string): Promise<User> {
        let user = await usersQueryRepository.findFieldWithValue('login', login)
        if(!user )  throw new LoginError('Wrong login or password');
        return user
    },

    async verifyPasswords(dtoPassword:string, userPassword:string) {
        const bcrypt = require('bcrypt');
        return await bcrypt.compare(dtoPassword, userPassword);
    }
}