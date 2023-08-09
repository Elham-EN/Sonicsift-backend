import { CreateUser } from "#/@types/user";
import User from "#/models/user";
import { Response } from "express";
import { generateToken } from "#/utils/helper";
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
