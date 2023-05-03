import express, { Application } from "express";
import bodyParser from "body-parser";
import logger from "jet-logger";
import * as dotenv from "dotenv";
import cors from "cors";

import apiRouter from "./routes";

dotenv.config();

const app: Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({ origin: "*" }));

app.use("/api", apiRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info("Server is running on PORT: " + PORT);
});
