import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({

    host: process.env.EMAIL_HOST,

    port: Number(process.env.EMAIL_PORT),

    secure: process.env.EMAIL_SECURE === "true",

    auth: {

        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASS,

    },

});


export const sendReplyEmail = async ({

    to,

    subject,

    html,

}) => {

    return transporter.sendMail({

        from: process.env.EMAIL_FROM,

        to,

        subject,

        html,

    });

};

export default transporter;