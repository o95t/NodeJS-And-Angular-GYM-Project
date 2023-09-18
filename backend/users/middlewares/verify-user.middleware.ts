import { RequestHandler } from "express";

import ErrorRequest from "../../error-request";
import IRequestBody from "../../types/request-body.interface";
import IRequestParams from "../types/request-params.interface";
import IUpdateRequestParams from "../types/update-request-params.interface";

const verifyUser: RequestHandler<
  IRequestParams | IUpdateRequestParams,
  unknown,
  IRequestBody
> = (req, _res, next) => {
  try {
    const { id } = req.params;
    const { tokenData } = req.body;

    if (id !== tokenData._id) {
      throw new ErrorRequest("Unauthorized", 401);
    }

    next();
  } catch (e) {
    next(e);
  }
};

export default verifyUser;
