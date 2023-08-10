import { Router } from "express";
import { validate } from "#/middlewares/validator";
import {
  CreateUserSchema,
  EmailVerificationBody,
} from "#/utils/validationSchema";
import { create, verifyEmail } from "#/controllers/user";

const router = Router();

router.post("/create", validate(CreateUserSchema), create);

router.post("/verify-email", validate(EmailVerificationBody), verifyEmail);

export default router;
