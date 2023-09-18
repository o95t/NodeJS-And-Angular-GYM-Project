import "dotenv/config";

import cors from "cors";
import express, { json, NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import path from "path";

import authRouter from "./auth/auth.router";
import verifyToken from "./auth/middlewares/verify-token.middleware";
import ErrorRequest from "./error-request";
import gymsRouter from "./gyms/gyms.router";
import usersRouter from "./users/users.router";

const app = express();

(async () => {
  try {
    if (process.env.DB_URI) {
      await mongoose.connect(process.env.DB_URI);
      console.log("Connected");
    } else {
      throw new Error("DB uri is undefined!");
    }
  } catch (e) {
    process.exit(0);
  }
})();

app.use(cors());
app.use(morgan("dev"));
app.use(json());

app.use("/auth", authRouter);
app.use("/users", verifyToken, usersRouter);
app.use("/gyms", verifyToken, gymsRouter);
app.use("/image", express.static(path.join(__dirname, "uploads")));

app.all("*", (_req, _res, next) => {
  next(new ErrorRequest("Route not found", 404));
});

app.use(
  (error: ErrorRequest, _req: Request, res: Response, _next: NextFunction) => {
    res
      .status(error.status || 500)
      .json({ success: false, data: error.message });
  }
);

app.listen(3000, () => console.log(`Listening on port 3000`));
