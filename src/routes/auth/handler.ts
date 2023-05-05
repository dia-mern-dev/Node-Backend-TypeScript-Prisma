import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { compareSync, hashSync } from "bcryptjs";
import jwt from "jsonwebtoken";

import prisma from "../../services/prisma";
import { IRegisterInfo } from "../../utils/types";
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
      result: {
        user: filterUserWithoutPass(user),
        token: {
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
      },
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error?.message ?? error });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, firstName, lastName, password, phone, role }: IRegisterInfo = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email: email } });
    if (existingUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Email already exist" });
    }
    const user = await prisma.user.create({
      data: { email, firstName, lastName, password: hashSync(password, 8), phone, role },
    });

    return res.status(StatusCodes.OK).json({ result: filterUserWithoutPass(user) });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error?.message ?? error });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { id } = req.payload;

    await prisma.userToken.deleteMany({ where: { userId: parseInt(id) } });

    return res.status(StatusCodes.OK).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error?.message ?? error });
  }
};

export const repairToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY ?? "") as jwt.JwtPayload;

    const savedToken = await prisma.userToken.findUnique({ where: { id: payload.jwtId } });

    const isCompareToken = compareSync(refreshToken, savedToken?.refreshToken ?? "");

    if (!isCompareToken) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized token" });
    }

    const existingUser = await prisma.user.findUnique({ where: { id: parseInt(payload?.id) } });

    if (!existingUser) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized account" });
    }

    await prisma.userToken.delete({ where: { id: savedToken?.id } });

    const { accessToken, refreshToken: newRefreshToken } = generateToken(existingUser.id, savedToken?.remember);

    return res.status(StatusCodes.OK).json({
      result: {
        user: filterUserWithoutPass(existingUser),
        token: {
          accessToken,
          refreshToken: newRefreshToken,
        },
      },
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error?.message ?? error });
  }
};
