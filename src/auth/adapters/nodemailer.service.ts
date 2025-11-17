import { SETTINGS } from '../../core/settings/settings';
import nodemailer from 'nodemailer';

export class NodemailerService {
  async sendEmail(email: string, template: string) {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: SETTINGS.EMAIL,
        pass: SETTINGS.EMAIL_PASS,
      },
    });
    console.log('email sending', email);
    try {
      await transporter.sendMail({
        from: '"Kek 👻"  <dropdox12@gmail.com>',
        to: email,
        subject: 'RegistrationInput',
        html: template, // html body
      });
      return;
    } catch (e: unknown) {
      console.log('Sending email failed', e);
    }
  }
}
