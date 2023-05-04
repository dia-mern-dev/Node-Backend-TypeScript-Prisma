import { Router } from "express";

import { login, register } from "./handler";
import { yupValidator } from "../../middleware/yupValidator";
import { registerSchema } from "../../utils/schema/user";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/register", yupValidator(registerSchema), register);

export default authRouter;
