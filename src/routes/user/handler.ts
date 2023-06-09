import fileUpload from "express-fileupload";
import fs from "fs-extra";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import prisma from "../../services/prisma";
import { IRegisterInfo } from "../../utils/types";
import { filterUserWithoutPass, randomId } from "../../utils/function";

export const updateCurrentUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.payload;
    const { firstName, lastName, phone, role }: IRegisterInfo = req.body;

    const existingUser = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!existingUser) {
      return res.status(StatusCodes.EXPECTATION_FAILED).json({ message: "User not found" });
    }

    const result = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { firstName, lastName, phone, role },
    });

    return res.status(StatusCodes.OK).json({ result: filterUserWithoutPass(result) });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error?.message ?? error });
  }
};

export const deleteCurrentUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.payload;

    const existingUser = await prisma.user.findUnique({ where: { id: parseInt(id) } });

    if (!existingUser) {
      return res.status(StatusCodes.EXPECTATION_FAILED).json({ message: "User not found" });
    }

    await prisma.user.delete({ where: { id: parseInt(id) } });
    await prisma.userToken.deleteMany({ where: { userId: existingUser.id } });

    return res.status(StatusCodes.OK).json({ message: "User Deleted" });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error?.message ?? error });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.payload;
    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });

    if (!user) {
      return res.status(StatusCodes.EXPECTATION_FAILED).json({ message: "User not found" });
    }

    const filterUser = filterUserWithoutPass({ ...user });

    return res.status(StatusCodes.OK).json({ result: filterUser });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error?.message ?? error });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({});

    if (!users.length) {
      return res.status(StatusCodes.EXPECTATION_FAILED).json({ message: "Users not found." });
    }

    const resData = users.map((item) => filterUserWithoutPass({ ...item }));

    return res.status(StatusCodes.OK).json({ result: resData });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error?.message ?? error });
  }
};

export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    const { id } = req.payload;
    const file = req.files?.file as fileUpload.UploadedFile;

    const validImageTypes = ["image/gif", "image/jpeg", "image/png", "image/jpg"];
    if (!validImageTypes.includes(file.mimetype)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "File type is not match! (gif, jpeg, png, jpg)" });
    }

    const avatarPath = `avatar/${id}.${file.mimetype.split("/")[1]}`;

    fs.ensureDir("src/public/upload/avatar");

    file.mv(`src/public/upload/${avatarPath}`);

    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });

    if (!user) {
      return res.status(StatusCodes.EXPECTATION_FAILED).json({ message: "User not found" });
    }

    await prisma.user.update({ where: { id: parseInt(id) }, data: { avatar: avatarPath } });

    return res.status(StatusCodes.OK).json({ message: "Uploaded successfully" });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error?.message ?? error });
  }
};

export const uploadPhotos = async (req: Request, res: Response) => {
  try {
    const { id } = req.payload;
    const files = req.files?.file as fileUpload.UploadedFile[];

    fs.ensureDir("src/public/upload/photo");

    if (!!files.length) {
      const photoUrls = files
        ?.filter((item) => ["image/gif", "image/jpeg", "image/png", "image/jpg"].includes(item?.mimetype))
        .map((file) => {
          const filePath = `photo/${id}-${randomId(4)}.${file.name?.split(".")[1]}`;
          file.mv(`src/public/upload/${filePath}`, (error) => {
            if (error) {
              return res.status(StatusCodes.EXPECTATION_FAILED).json({ message: "Upload error" });
            }
          });
          return filePath;
        });
      await prisma.user.update({ where: { id: parseInt(id) }, data: { photo: photoUrls.join(",") } });
    } else {
      const file = files as unknown as fileUpload.UploadedFile;

      const validImageTypes = ["image/gif", "image/jpeg", "image/png", "image/jpg"];
      if (!validImageTypes.includes(file.mimetype)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "File type is not match! (gif, jpeg, png, jpg)" });
      }

      const filePath = `photo/${id}-${randomId(4)}.${file?.name?.split(".")[1]}`;

      file.mv(`src/public/upload/${filePath}`);

      await prisma.user.update({ where: { id: parseInt(id) }, data: { photo: filePath } });
    }

    return res.status(StatusCodes.OK).json({ message: "Uploaded successfully" });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error?.message ?? error });
  }
};

export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.payload;
    const { imagePath, imageType }: { imagePath: string[]; imageType: string } = req.body;

    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });

    if (!user) {
      return res.status(StatusCodes.EXPECTATION_FAILED).json({ message: "User not found" });
    }

    const imagePaths = "photo/4-3530.jpg";

    if (!imagePath) {
      return res.status(StatusCodes.BAD_GATEWAY).json({ error: "Image path is not provided." });
    }

    if (imageType === "photo") {
      fs.unlink(`src/public/upload/${imagePath}`);
      const newPath = user?.photo?.replace(`${imagePaths},`, "");
      await prisma.user.update({ where: { id: parseInt(id) }, data: { photo: newPath } });
    }

    if (imageType === "avatar") {
      fs.unlink(`src/public/upload/${user.avatar}`);
      await prisma.user.update({ where: { id: parseInt(id) }, data: { avatar: null } });
    }

    return res.status(StatusCodes.OK).json({ message: "OK" });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error?.message ?? error });
  }
};
