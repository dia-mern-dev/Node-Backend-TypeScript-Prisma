import { Router } from "express";

import { login, logout, repairToken, register } from "./handler";
import { yupValidator } from "../../middleware/validationMiddleware";
import { loginSchema, registerSchema } from "../../utils/schema/user";
import { authMiddleware } from "../../middleware/authMiddleware";

const authRouter = Router();

authRouter.post("/login", yupValidator(loginSchema), login);
authRouter.post("/register", yupValidator(registerSchema), register);
authRouter.post("/logout", authMiddleware, logout);
authRouter.post("/refresh-token", repairToken);

export default authRouter;
