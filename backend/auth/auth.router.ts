import { Router } from "express";

import signIn from "./controllers/sign-in.controller";
import signUp from "./controllers/sign-up.controller";

const authRouter = Router();

authRouter.post("/sign-in", signIn);
authRouter.post("/sign-up", signUp);

export default authRouter;
