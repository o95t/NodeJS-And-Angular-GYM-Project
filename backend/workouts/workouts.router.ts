import { Router } from "express";
import multer from "multer";

import verifyToken from "../auth/middlewares/verify-token.middleware";
import createWorkout from "./controllers/create-workout.controller";
import deleteWorkout from "./controllers/delete-workout.controller";
import getWorkouts from "./controllers/get-workouts.controller";
import logsRouter from "../logs/logs.router";

const workoutsRouter = Router({ mergeParams: true });

workoutsRouter.get("/", getWorkouts);
workoutsRouter.post(
  "/",
  multer({ dest: "uploads/" }).single("image") as any,
  verifyToken,
  createWorkout
);
workoutsRouter.delete("/:workoutId", deleteWorkout);
workoutsRouter.use("/:workoutId/logs", logsRouter);

export default workoutsRouter;
