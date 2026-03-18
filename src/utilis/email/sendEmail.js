import nodemailer from "nodemailer";
import { emailTemplate } from "./emailTemplate.js";
export const sendEmail= async({to=[],cc=[],bcc=[],subject='',text='',code=''}={})=>{

// Create a transporter using Ethereal test credentials.
// For production, replace with your actual SMTP server details.
const transporter = nodemailer.createTransport({
  service:'gmail',
  secure: true, // Use true for port 465, false for port 587
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

  const info = await transporter.sendMail({
    from: `${process.env.USER}`,
    to,
    subject,
    text, // Plain-text version of the message
    html: emailTemplate(code), // HTML version of the message
  });

  console.log("Message sent:", info.messageId);
;
}