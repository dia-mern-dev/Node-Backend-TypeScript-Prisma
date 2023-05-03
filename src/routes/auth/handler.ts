import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { IRegisterInfo } from "../../utils/types";

export const login = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, password }: IRegisterInfo = req.body;
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
