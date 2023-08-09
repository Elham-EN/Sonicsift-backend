import { CreateUser } from "#/@types/user";
import User from "#/models/user";
import { Response } from "express";
import nodemailer from "nodemailer";
import { MAILTRAP_USER, MAILTRAP_PASS } from "#/utils/variables";

// Create User
export async function create(req: CreateUser, res: Response) {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });

  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: MAILTRAP_USER,
      pass: MAILTRAP_PASS,
    },
  });

  await transport.sendMail({
    to: user.email,
    from: "auth@myapp.com",
    subject: "Account Sign up",
    html: `<h1>Thank you for creating your account</h1>`,
  });

  res.status(201).json({ user });
}
