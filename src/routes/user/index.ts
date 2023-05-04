import { Router } from "express";

import { deleteCurrentUser, getAllUsers, getCurrentUser, updateCurrentUser } from "./handler";

const userRouter = Router();

userRouter.put("/", updateCurrentUser);
userRouter.delete("/", deleteCurrentUser);
userRouter.get("/", getCurrentUser);
userRouter.get("/all", getAllUsers);

export default userRouter;
