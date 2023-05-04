import { Router } from "express";

import authRouter from "./auth";
import userRouter from "./user";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", authMiddleware, userRouter);

export default router;
