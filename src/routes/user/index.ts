import { Router } from "express";

import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from "./handler";
import { registerSchema } from "../../utils/schema/user";
import { yupValidator } from "../../middleware/yupValidator";

const userRouter = Router();

userRouter.post("/", yupValidator(registerSchema), createUser);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);
userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);

export default userRouter;
