import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { AnySchema } from "yup";

export const yupValidator = (schema: AnySchema) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.validate({
      body: req.body,
      query: req.query,
    });
    return next();
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ "Validation error": error?.message ?? error });
  }
};
