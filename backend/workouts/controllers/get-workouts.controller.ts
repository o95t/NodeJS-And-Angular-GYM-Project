import { RequestHandler } from "express";
import { Types } from "mongoose";

import ErrorRequest from "../../error-request";
import IGymParams from "../../gyms/types/gym-params.interface";
import gymModel from "../../models/gym.model";
import { IWorkout } from "../../models/workout.model";
import IResponse from "../../types/response.interface";

const getWorkouts: RequestHandler<IGymParams, IResponse<IWorkout[]>> = async (
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

    res.json({ success: true, data: gym.workouts });
  } catch (e) {
    next(e);
  }
};

export default getWorkouts;
