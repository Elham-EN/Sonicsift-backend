import { CreateUser } from "#/@types/user";
import User from "#/models/user";
import { Response } from "express";

// Create User
export async function create(req: CreateUser, res: Response) {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });
  res.status(201).json({ user });
}
