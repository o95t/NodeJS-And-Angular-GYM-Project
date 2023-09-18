import { RequestHandler } from "express";
import { verify } from "jsonwebtoken";

import ErrorRequest from "../../error-request";

const verifyToken: RequestHandler<unknown> = (req, _res, next) => {
  try {
    if (
      !req.headers.authorization ||
      req.headers.authorization.split(" ")[0] !== "Bearer"
    ) {
      throw new ErrorRequest("Unauthorized", 401);
    }

    const tokenData = verify(
      req.headers.authorization.split(" ")[1],
      process.env.JWT_SECRET!
    );

    if (!tokenData) {
      throw new ErrorRequest("Unauthorized", 401);
    }

    req.body.tokenData = tokenData;
    next();
  } catch (e) {
    next(e);
  }
};

export default verifyToken;
