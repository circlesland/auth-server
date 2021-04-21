import nodemailer from "nodemailer";
import mustache from "mustache";
import {Template} from "./template";
import {newLogger} from "@circlesland/auth-util/dist/logger";

const logger = newLogger("/packages/mailer/src/mailer.ts");

export class Mailer
{
    static async send(template:Template, data:object, to:string)
    {
        if (!process.env.SMTP_USER
         || !process.env.SMTP_PORT
         || !process.env.SMTP_USER
         || !process.env.SMTP_PASS
         || !process.env.SMTP_SENDER)
            throw new Error("One of the SMTP settings is missing in the environment variables");

        const tls: {
            ciphers?: string;
        } = {};

        if (process.env.SMTP_SECURE) {
            if (!process.env.SMTP_SECURE_CIPHERS) {
                throw new Error(`The process.env.SMTP_SECURE_CIPHERS environment variable is not set`);
            }
            tls.ciphers = process.env.SMTP_SECURE_CIPHERS;
        }

        const transport = nodemailer.createTransport({
            host: process.env.SMTP_SERVER,
            port: parseInt(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE?.toLowerCase() == "true" ?? false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            },
            tls: tls
        });

        const mail = {
            from: process.env.SMTP_SENDER,
            to: to,
            subject: mustache.render(template.subject, data),
            html: mustache.render(template.bodyHtml, data),
            text: mustache.render(template.bodyPlain, data),
        };

        logger.log(`Sending mail '${mail.subject}' from '${mail.from}' to '${mail.to}' ..`);

        await transport.sendMail(mail)

        logger.log(`Sending mail '${mail.subject}' from '${mail.from}' to '${mail.to}' .. Mail sent.`);
    }
}
