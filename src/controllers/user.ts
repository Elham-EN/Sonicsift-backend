import { CreateUser, VerifyEmailRequest } from "#/@types/user";
import User from "#/models/user";
import { Request, Response } from "express";
import { generateToken } from "#/utils/helper";
import { sendVerificationMail } from "#/utils/mail";
import EmailVerificationToken from "#/models/emailVerificationToken";
import { isValidObjectId } from "mongoose";

// Create User
export async function create(req: CreateUser, res: Response) {
  const { name, email, password } = req.body;

  // Create user document in MongoDB Database
  const user = await User.create({ name, email, password });

  // Send verification email
  const token = generateToken();
  await EmailVerificationToken.create({
    owner: user._id,
    token,
  });
  await sendVerificationMail(token, {
    userId: user._id.toString(),
    name: name,
    email: email,
  });

  res.status(201).json({ id: user._id, name, email });
}

// Create route from where we can send OTP to verifiy the email
export async function verifyEmail(req: VerifyEmailRequest, res: Response) {
  const { token, userId } = req.body;

  const verificationToken = await EmailVerificationToken.findOne({
    owner: userId,
  });

  if (!verificationToken)
    return res.status(403).json({ error: "Invalid Token!" });

  const matched = await verificationToken.compareToken(token);

  if (!matched) return res.status(403).json({ error: "Invalid Token!" });

  // Verify that user's email is real
  await User.findByIdAndUpdate(userId, {
    verified: true,
  });

  // Once user's email is verified, token no longer needed (Delete Doc)
  await EmailVerificationToken.findByIdAndDelete(verificationToken._id);

  res.json({ message: "Your email is verified" });
}

// Create route from where we can send OTP to verifiy the email
export async function sendReVerificationToken(req: Request, res: Response) {
  const { userId } = req.body;

  if (!isValidObjectId(userId))
    return res.status(403).json({ error: "user not found" });

  const user = await User.findById(userId as string);
  if (!user) return res.status(403).json({ error: "Invalid request!" });

  // remove the previous token
  await EmailVerificationToken.findOneAndDelete({
    owner: userId,
  });

  console.log("Hello World");

  // Re-genarate a new token
  const token = generateToken();
  await EmailVerificationToken.create({
    owner: userId as string,
    token: token,
  });

  await sendVerificationMail(token, {
    name: user?.name,
    email: user?.email,
    userId: user?._id.toString(),
  });

  res.json({ message: "Please check your email" });
}
