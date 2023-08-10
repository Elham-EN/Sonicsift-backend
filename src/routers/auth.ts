import { Router } from "express";
import { validate } from "#/middlewares/validator";
import { CreateUserSchema } from "#/utils/validationSchema";
import { create, verifyEmail } from "#/controllers/user";

const router = Router();

router.post("/create", validate(CreateUserSchema), create);

router.post("/verify-email", verifyEmail);

export default router;
