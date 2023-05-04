import { Router } from "express";

import { deleteUser, getAllUsers, getUserById, updateUser } from "./handler";

const userRouter = Router();

userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);
userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);

export default userRouter;
