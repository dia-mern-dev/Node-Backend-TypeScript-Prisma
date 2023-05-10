import { Router } from "express";
import { deleteMulterFile, uploadPhotos, uploadWithMulter } from "./handler";

const uploadRouter = Router();

uploadRouter.post("/", uploadPhotos);
uploadRouter.post("/multer-upload", uploadWithMulter);
uploadRouter.delete("/multer-image", deleteMulterFile);

export default uploadRouter;
