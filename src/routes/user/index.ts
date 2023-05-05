import { Router } from "express";

import { deleteCurrentUser, getAllUsers, getCurrentUser, updateCurrentUser, uploadAvatar } from "./handler";

const userRouter = Router();

userRouter.put("/", updateCurrentUser);
userRouter.delete("/", deleteCurrentUser);
userRouter.get("/", getCurrentUser);
userRouter.get("/all", getAllUsers);
userRouter.put("/avatar", uploadAvatar);

export default userRouter;
