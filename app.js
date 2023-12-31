import express from "express";
import logger from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { authRouter, statsRouter, wordsRouter } from "./routes/index.js";
import { authenticate } from "./middlewares/index.js";
dotenv.config();

const { BASE_SITE_URL } = process.env;

export const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";
const corsConfig = {
  origin: BASE_SITE_URL,
  credentials: true,
};

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));
app.use(logger(formatsLogger));
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", 1);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/stats", authenticate, statsRouter);
app.use("/api/v1/words", authenticate, wordsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  res.status(status).json({ message: err.message });
});
