import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { compareSync } from "bcryptjs";

import prisma from "../../lib/prisma";
import { filterUserWithoutPass } from "../../utils/functions";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user) {
      return res.status(StatusCodes.EXPECTATION_FAILED).json({ message: "User not found" });
    }

    const isValidPassword = compareSync(password, user.password);

    if (!isValidPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Password is not correct." });
    }

    return res.status(StatusCodes.OK).json({ result: filterUserWithoutPass(user) });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error?.message ?? error });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    console.log("data: ", data);
    return res.status(StatusCodes.OK).json({ data: data });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error?.message ?? error });
  }
};
