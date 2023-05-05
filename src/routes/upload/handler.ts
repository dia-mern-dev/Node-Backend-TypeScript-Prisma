import fileUpload from "express-fileupload";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    const { id } = req.payload;
    const file = req.files?.file as fileUpload.UploadedFile;

    const filePath = `avatar/${id}.${file.mimetype?.split("/")[1]}`;

    file.mv(`src/public/upload/${filePath}`, (error) => {
      if (error) {
        return res.status(StatusCodes.EXPECTATION_FAILED).json({ message: "Upload error" });
      }
    });
    return res.status(StatusCodes.OK).json({ message: "OK" });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error?.message ?? error });
  }
};
