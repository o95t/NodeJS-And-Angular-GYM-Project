import { Router } from "express";
import multer from "multer";

import verifyToken from "../auth/middlewares/verify-token.middleware";
import membersRouter from "../members/members.router";
import workoutsRouter from "../workouts/workouts.router";
import createGym from "./controllers/create-gym.controller";
import deleteGym from "./controllers/delete-gym.controller";
import getActiveWorkout from "./controllers/get-active-workout.controller";
import getGym from "./controllers/get-gym.controller";
import getGyms from "./controllers/get-gyms.controller";
import updateGym from "./controllers/update-gym.controller";

const gymsRouter = Router();

gymsRouter.get("/", getGyms);
gymsRouter.post(
  "/",
  multer({ dest: "uploads/" }).single("image") as any,
  verifyToken,
  createGym
);
gymsRouter.get("/:id", getGym);
gymsRouter.get("/:id/active-workout", getActiveWorkout);
gymsRouter.delete("/:id", deleteGym);
gymsRouter.put("/:id", updateGym);
gymsRouter.use("/:id/members", membersRouter);
gymsRouter.use("/:id/workouts", workoutsRouter);

export default gymsRouter;
