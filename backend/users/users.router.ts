import { Router } from "express";
import multer from "multer";

import verifyToken from "../auth/middlewares/verify-token.middleware";
import createAvatar from "./controllers/create-avatar.controller";
import createGym from "./controllers/create-gym.controller";
import createRequest from "./controllers/create-request.controller";
import deleteGym from "./controllers/delete-gym.controller";
import getFriends from "./controllers/get-friends.controller";
import getGyms from "./controllers/get-gyms.controller";
import getRequests from "./controllers/get-requests.controller";
import getSentRequests from "./controllers/get-sent-requests.controller";
import getUser from "./controllers/get-user.controller";
import updateRequest from "./controllers/update-request.controller";
import verifyUser from "./middlewares/verify-user.middleware";

const usersRouter = Router();

usersRouter.get("/:id", getUser);
usersRouter.get("/:id/sent-requests", getSentRequests);
usersRouter.get("/:id/requests", verifyUser, getRequests);
usersRouter.get("/:id/friends", getFriends);
usersRouter.get("/:id/gyms", verifyUser, getGyms);
usersRouter.put("/:id/requests", verifyUser, createRequest);
usersRouter.patch("/:id/requests", verifyUser, updateRequest);
usersRouter.put(
  "/:id/avatar",
  multer({ dest: "uploads/" }).single("image") as any,
  verifyToken,
  verifyUser,
  createAvatar
);
usersRouter.put("/:id/gyms", verifyUser, createGym);
usersRouter.delete("/:id/gyms/:gymId", verifyUser, deleteGym);

export default usersRouter;
