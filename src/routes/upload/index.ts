import { Router } from "express";
import { uploadPhotos } from "./handler";

const uploadRouter = Router();

uploadRouter.post("/", uploadPhotos);

export default uploadRouter;
