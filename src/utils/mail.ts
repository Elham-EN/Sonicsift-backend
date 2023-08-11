import nodemailer from "nodemailer";
import { MAILTRAP_USER, MAILTRAP_PASS, SIGN_IN_URL } from "./variables";
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

interface Options {
  email: string;
  link: string;
}

export async function sendForgetPassworkLink(options: Options) {
  const { email, link } = options;

  const message = `We just received a request that you forgot your 
  password. You can use the link below and creat brand new password.`;

  const transport = generateMailTransporter();

  transport.sendMail({
    to: email,
    from: VERIFICATION_EMAIL,
    subject: "Password Reset Link",
    html: generateTemplate({
      title: "Forgot Password",
      message: message,
      logo: "cid:logo",
      banner: "cid:forget_password",
      link: link,
      btnTitle: "Reset Password",
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/logo.png"),
        cid: "logo",
      },
      {
        filename: "forget_password.png",
        path: path.join(__dirname, "../mail/forget_password.png"),
        cid: "forget_password",
      },
    ],
  });
}

interface PassResetOptions {
  email: string;
  link: string;
  name: string;
}

export async function sendPassResetSuccessEmail(name: string, email: string) {
  const message = `Dear ${name} we just updated your new password. You can 
  now sign in with your new password`;

  const transport = generateMailTransporter();

  transport.sendMail({
    to: email,
    from: VERIFICATION_EMAIL,
    subject: "Password Reset Successfully",
    html: generateTemplate({
      title: "Password Reset Successfully",
      message: message,
      logo: "cid:logo",
      banner: "cid:forget_password",
      link: SIGN_IN_URL,
      btnTitle: "Sign in",
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/logo.png"),
        cid: "logo",
      },
      {
        filename: "forget_password.png",
        path: path.join(__dirname, "../mail/forget_password.png"),
        cid: "forget_password",
      },
    ],
  });
}
