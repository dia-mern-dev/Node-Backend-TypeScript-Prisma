import { Router } from "express";
import { uploadPhotos, uploadWithMulter } from "./handler";

const uploadRouter = Router();

uploadRouter.post("/", uploadPhotos);
uploadRouter.post("/multer-upload", uploadWithMulter);

export default uploadRouter;
