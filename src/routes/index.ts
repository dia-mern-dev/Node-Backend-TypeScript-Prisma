import { Router } from "express";

import authRouter from "./auth";
import uploadRouter from "./upload";
import userRouter from "./user";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", authMiddleware, userRouter);
router.use("/upload", authMiddleware, uploadRouter);

export default router;
