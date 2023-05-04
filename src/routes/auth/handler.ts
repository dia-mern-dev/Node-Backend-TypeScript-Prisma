import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { compareSync } from "bcryptjs";

import prisma from "../../services/prisma";
import { filterUserWithoutPass } from "../../utils/function";
import { generateToken } from "./helper";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, remember } = req.body;

    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user) {
      return res.status(StatusCodes.EXPECTATION_FAILED).json({ message: "Unregistered account" });
    }

    const isValidPassword = compareSync(password, user.password);

    if (!isValidPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Password is not correct." });
    }

    const { accessToken, refreshToken } = generateToken(user.id, remember);

    return res.status(StatusCodes.OK).json({
      result: filterUserWithoutPass(user),
      token: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    });
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
