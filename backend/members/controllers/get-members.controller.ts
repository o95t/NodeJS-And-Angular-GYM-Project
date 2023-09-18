import { RequestHandler } from "express";

import IGymParams from "../../gyms/types/gym-params.interface";
import gymModel, { IGym } from "../../models/gym.model";
import IResponse from "../../types/response.interface";
import { ObjectId } from "mongodb";
import ErrorRequest from "../../error-request";
import { IUser } from "../../models/user.model";

const getMembers: RequestHandler<IGymParams, IResponse<IUser[]>> = async (
  req,
  res,
  next
) => {
  try {
    const gym = await gymModel.findOne({ _id: new ObjectId(req.params.id) });

    if (!gym) {
      next(new ErrorRequest("Bad request", 400));
      return;
    }

    res.json({ success: true, data: gym.members });
  } catch (e) {
    next(e);
  }
};

export default getMembers;
