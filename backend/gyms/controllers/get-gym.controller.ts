import { RequestHandler } from "express";

import gymModel, { IGym } from "../../models/gym.model";
import IResponse from "../../types/response.interface";
import IGymParams from "../types/gym-params.interface";
import { Types } from "mongoose";
import ErrorRequest from "../../error-request";

const getGym: RequestHandler<IGymParams, IResponse<IGym>> = async (
  req,
  res,
  next
) => {
  try {
    const gym = await gymModel.findOne({
      _id: new Types.ObjectId(req.params.id),
    });

    if (!gym) {
      next(new ErrorRequest("Bad request", 400));
      return;
    }

    res.json({ success: true, data: gym });
  } catch (e) {
    next(e);
  }
};

export default getGym;
