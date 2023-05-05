import { Router } from "express";

import { authMiddleware } from "../../middleware/authMiddleware";
import { login, logout, repairToken, register } from "./handler";
import { loginSchema, registerSchema } from "../../utils/schema/user";
import { yupValidator } from "../../middleware/validationMiddleware";

const authRouter = Router();

authRouter.post("/login", yupValidator(loginSchema), login);
authRouter.post("/register", yupValidator(registerSchema), register);
authRouter.post("/logout", authMiddleware, logout);
authRouter.post("/refresh-token", repairToken);

export default authRouter;
