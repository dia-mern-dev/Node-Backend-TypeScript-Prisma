import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import prisma from "../services/prisma";
import { StatusCodes } from "http-status-codes";

declare module "express-serve-static-core" {
  interface Request {
    payload: JwtPayload;
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Token not found." });
    }
    const payload = jwt.verify(bearerToken?.split(" ")[1] ?? "", process.env.ACCESS_SECRET_KEY ?? "") as jwt.JwtPayload;

    const user = await prisma.user.findUnique({ where: { id: parseInt(payload.id) } });
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unregistered account" });
    }

    req.payload = payload;
  } catch (error) {
    if (error?.name === "TokenExpiredError") {
      return res.status(StatusCodes.EXPECTATION_FAILED).json({ message: "Token Expired" });
    }

    if (error?.name === "JsonWebTokenError") {
      return res.status(StatusCodes.EXPECTATION_FAILED).json({ message: "InValid Token" });
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error });
  }

  return next();
};
