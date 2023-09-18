import { RequestHandler } from "express";
import { Types } from "mongoose";

import ErrorRequest from "../../error-request";
import gymModel from "../../models/gym.model";
import { IWorkout } from "../../models/workout.model";
import IResponse from "../../types/response.interface";
import IGymParams from "../types/gym-params.interface";

const getActiveWorkout: RequestHandler<
  IGymParams,
  IResponse<IWorkout | null>
> = async (req, res, next) => {
  try {
    const gym = await gymModel.findOne(
      {
        _id: new Types.ObjectId(req.params.id),
      },
      { activeWorkout: 1 }
    );

    if (!gym) {
      next(new ErrorRequest("Bad request", 400));
      return;
    }

    res.json({ success: true, data: gym.activeWorkout || null });
  } catch (e) {
    next(e);
  }
};

export default getActiveWorkout;
