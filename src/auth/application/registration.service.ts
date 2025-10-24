import {usersService} from "../../users/application/users.service";
import {nodemailerService} from "../adapters/nodemailer.service";
import {Registration} from "../types/Registration";

export const registrationService = {
    async register(userDto: Registration) {
        await usersService.create(userDto);
        nodemailerService.sendEmail().catch((error) => {
            console.log('Email sending failed', error);
        })
    }
}