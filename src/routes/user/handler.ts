import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { hashSync } from "bcryptjs";

import prisma from "../../services/prisma";
import { IRegisterInfo } from "../../utils/types";
import { filterUserWithoutPass } from "../../utils/functions";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, firstName, lastName, password, phone, role }: IRegisterInfo = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email: email } });
    if (existingUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Email already exist" });
    }
    const user = await prisma.user.create({
      data: { email, firstName, lastName, password: hashSync(password, 8), phone, role },
    });

    return res.status(StatusCodes.OK).json({ result: user });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error?.message ?? error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phone, role }: IRegisterInfo = req.body;

    const existingUser = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!existingUser) {
      return res.status(StatusCodes.EXPECTATION_FAILED).json({ message: "User not found" });
    }

    const result = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { firstName, lastName, phone, role },
    });

    return res.status(StatusCodes.OK).json({ result: result });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error?.message ?? error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingUser = await prisma.user.findUnique({ where: { id: parseInt(id) } });

    if (!existingUser) {
      return res.status(StatusCodes.EXPECTATION_FAILED).json({ message: "User not found" });
    }

    await prisma.user.delete({ where: { id: parseInt(id) } });

    return res.status(StatusCodes.OK).json({ message: "User Deleted" });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error?.message ?? error });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
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
