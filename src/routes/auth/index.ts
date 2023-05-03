import { Router } from "express";

const authRouter = Router();

authRouter.post("/register", (req, res) => {
  const data = req.body;
  console.log("data: ", data);
  return res.json({ message: "you called register api" });
});

export default authRouter;
