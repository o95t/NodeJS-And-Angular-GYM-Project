import { Router } from "express";

import createMember from "./controllers/create-member.controller";
import deleteMember from "./controllers/delete-member.controller";
import getMembers from "./controllers/get-members.controller";

const membersRouter = Router({ mergeParams: true });

membersRouter.get("/", getMembers);
membersRouter.post("/", createMember);
membersRouter.delete("/:memberId", deleteMember);

export default membersRouter;
