import { Router } from "express";

import createLog from "./controllers/create-log.controller";
import deleteLog from "./controllers/delete-log.controller";

const logsRouter = Router({ mergeParams: true });

logsRouter.post("/", createLog);
logsRouter.delete("/:logId", deleteLog);

export default logsRouter;
