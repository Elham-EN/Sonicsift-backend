import User from "#/models/user";
import { Router } from "express";

const router = Router();

router.post("/create", async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });
  res.json({ user });
});

export default router;