import nodemailer from "nodemailer";
import { MAILTRAP_USER, MAILTRAP_PASS } from "./variables";
import EmailVerificationToken from "#/models/emailVerificationToken";
import path from "path";
import { generateTemplate } from "#/mail/template";
import { VERIFICATION_EMAIL } from "./variables";

function generateMailTransporter() {
  return nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: MAILTRAP_USER,
      pass: MAILTRAP_PASS,
    },
  });
}

interface Profile {
  name: string;
  email: string;
  userId: string;
}

export async function sendVerificationMail(token: string, profile: Profile) {
  const { name, email, userId } = profile;

  const transport = generateMailTransporter();

  const welcomeMessage = `Hi ${name}, welcome to SonicSift! There 
  are so much that we do for verified users. Use the given OTP to 
  verify your email.`;

  await transport.sendMail({
    to: email,
    from: VERIFICATION_EMAIL,
    subject: "Account Sign up",
    html: generateTemplate({
      title: "Welcome to SonicSift",
      message: welcomeMessage,
      logo: "cid:logo",
      banner: "cid:welcome",
      link: "#",
      btnTitle: token,
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/logo.png"),
        cid: "logo",
      },
      {
        filename: "welcome.png",
        path: path.join(__dirname, "../mail/welcome.png"),
        cid: "welcome",
      },
    ],
  });
}
