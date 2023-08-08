import { CreateUser } from "#/@types/user";
import User from "#/models/user";
import { Router } from "express";
import { validate } from "#/middlewares/validator";
import { CreateUserSchema } from "#/utils/validationSchema";

const router = Router();

router.post(
  "/create",
  validate(CreateUserSchema),
  async (req: CreateUser, res) => {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    res.json({ user });
  }
);

export default router;
