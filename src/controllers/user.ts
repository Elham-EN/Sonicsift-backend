import { CreateUser } from "#/@types/user";
import User from "#/models/user";
import EmailVerificationToken from "#/models/emailVerificationToken";
import { Response } from "express";
import nodemailer from "nodemailer";
import { MAILTRAP_USER, MAILTRAP_PASS } from "#/utils/variables";
import { generateToken } from "#/utils/helper";
import { generateTemplate } from "#/mail/template";
import path from "path";
import { sendVerificationMail } from "#/utils/mail";

// Create User
export async function create(req: CreateUser, res: Response) {
  const { name, email, password } = req.body;

  // Create user document in MongoDB Database
  const user = await User.create({ name, email, password });

  // Send verification email
  const token = generateToken();
  await sendVerificationMail(token, {
    userId: user._id.toString(),
    name: name,
    email: email,
  });

  res.status(201).json({ id: user._id, name, email });
}
