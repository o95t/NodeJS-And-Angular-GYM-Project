import { RequestHandler } from "express";
import { Types } from "mongoose";

import authModel, { IAuth } from "../../models/auth.model";
import IResponse from "../../types/response.interface";
import IRequestParams from "../types/request-params.interface";
import ErrorRequest from "../../error-request";

const getUser: RequestHandler<IRequestParams, IResponse<IAuth>> = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    const user = await authModel.findOne(
      {
        _id: new Types.ObjectId(id),
      },
      {
        password: 0,
        requests: 0,
        friends: 0,
      }
    );

    if (!user) {
      next(new ErrorRequest("Bad request", 400));
      return;
    }

    res.json({ success: true, data: user });
  } catch (e) {
    next(e);
  }
};

export default getUser;
