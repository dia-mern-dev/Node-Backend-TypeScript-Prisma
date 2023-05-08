import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

import prisma from "../services/prisma";

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

    req.payload = payload;

    return next();
  } catch (error) {
    if (error?.name === "TokenExpiredError") {
      return res.status(StatusCodes.EXPECTATION_FAILED).json({ message: "Token expired" });
    }

    if (error?.name === "JsonWebTokenError") {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "InValid token" });
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error?.message ?? error });
  }
};
