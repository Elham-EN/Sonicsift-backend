import { Router } from "express";
import { validate } from "#/middlewares/validator";
import { CreateUserSchema } from "#/utils/validationSchema";
import { create } from "#/controllers/user";

const router = Router();

router.post("/create", validate(CreateUserSchema), create);

export default router;
