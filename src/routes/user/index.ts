import { Router } from "express";

import {
  deleteCurrentUser,
  deleteImage,
  getAllUsers,
  getCurrentUser,
  updateCurrentUser,
  uploadAvatar,
  uploadPhotos,
} from "./handler";

const userRouter = Router();

userRouter.put("/", updateCurrentUser);
userRouter.delete("/", deleteCurrentUser);
userRouter.get("/", getCurrentUser);
userRouter.get("/all", getAllUsers);
userRouter.put("/avatar", uploadAvatar);
userRouter.put("/photo", uploadPhotos);
userRouter.put("/delete-image", deleteImage);

export default userRouter;
