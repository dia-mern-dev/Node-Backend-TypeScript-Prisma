import { Router } from "express";
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from "./handler";

const userRouter = Router();

userRouter.post("/", createUser);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);
userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);

export default userRouter;
