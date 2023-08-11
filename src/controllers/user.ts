import { CreateUser, UpdatePassword, VerifyEmailRequest } from "#/@types/user";
import User from "#/models/user";
import EmailVerificationToken from "#/models/emailVerificationToken";
import PasswordResetToken from "#/models/passwordResetToken";
import { Request, Response } from "express";
import { generateToken } from "#/utils/helper";
import {
  sendForgetPassworkLink,
  sendPassResetSuccessEmail,
  sendVerificationMail,
} from "#/utils/mail";
import { isValidObjectId } from "mongoose";
import crypto from "crypto";
import { PASSWORD_RESET_LINK } from "#/utils/variables";

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

// When user forgot it's password, send its email to get reset password link
export async function genarateForgetPasswordLink(req: Request, res: Response) {
  const { email } = req.body;

  const user = await User.findOne({ email });

  // To ensure user with that email provided exist in the database
  if (!user) return res.status(404).json({ error: "Account not found" });

  // generate the link (send to user's email inbox)ß
  // https://yourapp.com/reset-password?token=gejhj34j3njn&userId=65kjlkj434

  // remove the previous token
  await PasswordResetToken.findOneAndDelete({
    owner: user._id,
  });

  const token = crypto.randomBytes(36).toString("hex");

  await PasswordResetToken.create({
    owner: user._id,
    token,
  });

  const resetLink = `${PASSWORD_RESET_LINK}?token=${token}&userId=${user._id}`;

  sendForgetPassworkLink({ email: user.email, link: resetLink });

  // Send link only to registerd account with that email
  res.status(201).json({ message: "Check your email for reset password link" });
}

// Verifying Password reset token
export async function grantValid(_req: Request, res: Response) {
  res.json({ valid: true });
}

export async function updatePassword(req: UpdatePassword, res: Response) {
  const { password, userId } = req.body;

  const user = await User.findById(userId);

  if (!user) return res.status(403).json({ error: "Unauthorised access" });

  const matched = await user.comparePassword(password);

  if (matched)
    return res
      .status(422)
      .json({ error: "The new password must be differenct" });

  user.password = password; // automatically hash password
  await user.save();

  await PasswordResetToken.findOneAndDelete({ owner: user._id });

  // Send success email
  await sendPassResetSuccessEmail(user.name, user.email);

  res.json({ message: "Password resets successfully" });
}
