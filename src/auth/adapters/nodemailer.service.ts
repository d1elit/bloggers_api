import {SETTINGS} from "../../core/settings/settings";
import nodemailer from 'nodemailer'
import {emailExamples} from "./emailExamples";

export const nodemailerService = {
      async sendEmail(
        // email: string,
        code: string,
        // template: string,
    ) {


        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: SETTINGS.EMAIL,
                pass: SETTINGS.EMAIL_PASS,
            },
        });

        try {
            let info = await transporter.sendMail({
                from: '"Kek 👻"  <dr1pdef@gmail.com>',
                to: "dr1pdef@gmail.com",
                subject: 'Registration',
                html: emailExamples.registrationEmail(code), // html body
            });
            return;
        } catch(e:unknown) {
            console.log('Sending email failed', e);
        }



    },
};