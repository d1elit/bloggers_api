import {UserInput} from "../router/input/user.input";
import {usersRepository} from "../repositories/users.repository";

export const usersService = {
    async create(userDto: UserInput) {
        const newUser = {
            login: userDto.login,
            password: userDto.password,
            email: userDto.email,
            createdAt: new Date().toISOString(),
        }
        return await usersRepository.create(newUser)
    },

    async delete(id:string) {
        return usersRepository.delete(id)
    }
}