import {SETTINGS} from "../../core/settings/settings";
import nodemailer from 'nodemailer'

export const template = `<h1>Thank for your registration</h1>
 <p>To finish registration please follow the link below:
     <a href='https://somesite.com/confirm-email?code=your_confirmation_code'>complete registration</a>
 </p>`


export const nodemailerService = {
      async sendEmail(
        // email: string,
        // code: string,
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
                to: "dropdox12@gmail.com",
                subject: 'register',
                html: template, // html body
            });
            return;
        } catch(e:unknown) {
            console.log('Sending email failed', e);
        }



    },
};