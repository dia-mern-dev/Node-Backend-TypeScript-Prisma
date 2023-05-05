import { Router } from "express";
import { uploadAvatar } from "./handler";

const uploadRouter = Router();

uploadRouter.post("/", uploadAvatar);

export default uploadRouter;
