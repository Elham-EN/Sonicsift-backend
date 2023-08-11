import { Request, Response, NextFunction } from "express";
import PasswordResetToken from "#/models/passwordResetToken";

// Verifying Password reset token
export async function isValidPassResetToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { token, userId } = req.body;

  const resetToken = await PasswordResetToken.findOne({ owner: userId });

  if (!resetToken)
    return res
      .status(403)
      .json({ error: "Unauthourized access invalid token" });

  const matched = await resetToken.compareToken(token);

  if (!matched)
    return res
      .status(403)
      .json({ error: "Unauthourized access invalid token" });

  next();
}
