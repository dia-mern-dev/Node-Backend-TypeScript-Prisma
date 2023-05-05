import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { hashSync } from "bcryptjs";

import prisma from "../../services/prisma";

export const generateJwtToken = (data: { [key: string]: string }, secretKey: string, expiresIn?: string) => {
  return expiresIn ? jwt.sign(data, secretKey, { expiresIn }) : jwt.sign(data, secretKey);
};

export const addTokenToWhiteList = async (userId: number, refreshToken: string) => {
  return await prisma.userToken.create({
    data: { userId: userId, refreshToken: hashSync(refreshToken, 10) },
  });
};

export const generateToken = (id: number, remember = false) => {
  const accessToken = generateJwtToken(
    { id: id.toString() },
    process.env.ACCESS_SECRET_KEY ?? "",
    process.env.ACCESS_EXPIRE_TIME,
  );

  const jwtId = uuidv4();
  const refreshToken = generateJwtToken(
    { id: id.toString(), jwtId },
    process.env.REFRESH_SECRET_KEY ?? "",
    remember ? process.env.REFRESH_REMEMBER_EXPIRE_TIME : process.env.REFRESH_EXPIRE_TIME,
  );

  addTokenToWhiteList(id, refreshToken);

  return { accessToken, refreshToken };
};
