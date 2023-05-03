import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import logger from "jet-logger";

const app: Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.json({ data: "Healthy" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info("Server is running on PORT: " + PORT);
});
