import fileUpload from "express-fileupload";
import fs from "fs-extra";
import multer from "multer";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import prisma from "../../services/prisma";
import { randomId } from "../../utils/function";

export const uploadPhotos = async (req: Request, res: Response) => {
  try {
    const { id } = req.payload;
    const files = req.files?.file as fileUpload.UploadedFile[];

    const photoUrls = files
      ?.filter((item) => ["image/gif", "image/jpeg", "image/png", "image/jpg"].includes(item?.mimetype))
      .map((file) => {
        const filePath = `photo/${id}-${randomId(4)}.${file.name?.split(".")[1]}`;
        fs.ensureDir("src/public/upload/photo");
        file.mv(`src/public/upload/${filePath}`, (error) => {
          if (error) {
            return res.status(StatusCodes.EXPECTATION_FAILED).json({ message: "Upload error" });
          }
        });
        return filePath;
      });

    await prisma.user.update({ where: { id: parseInt(id) }, data: { photo: photoUrls.join(",") } });

    return res.status(StatusCodes.OK).json({ message: "Uploaded successfully" });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error?.message ?? error });
  }
};

export const uploadWithMulter = (req: Request, res: Response) => {
  try {
    const { id } = req.payload;
    const file = req.file;
    console.log("file: ", file);

    const storageEngine = multer.diskStorage({
      destination: "./src/public/multer/image",
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}--${file.originalname}`);
      },
    });

    const upload = multer({
      storage: storageEngine,
    });

    upload.single("file");

    return res.status(StatusCodes.OK).json({ message: "OK" });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error?.message ?? error });
  }
};
