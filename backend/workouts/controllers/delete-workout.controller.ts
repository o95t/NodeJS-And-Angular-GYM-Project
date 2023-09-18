import { RequestHandler } from "express";
import { Types, UpdateWriteOpResult } from "mongoose";

import ErrorRequest from "../../error-request";
import gymModel from "../../models/gym.model";
import IRequestBody from "../../types/request-body.interface";
import IResponse from "../../types/response.interface";
import IWorkoutParams from "../types/workouts-params.interface";

const deleteWorkout: RequestHandler<
  IWorkoutParams,
  IResponse<UpdateWriteOpResult>,
  IRequestBody
> = async (req, res, next) => {
  try {
    const { id, workoutId } = req.params;
    const { tokenData } = req.body;
    const _id = new Types.ObjectId(id);
    const gym = await gymModel.findOne({
      _id,
    });

    if (!gym) {
      next(new ErrorRequest("Bad request", 400));
      return;
    }

    if (gym?.createdBy?.userId.toString() !== tokenData._id) {
      next(new ErrorRequest("Unauthorized", 401));
      return;
    }

    const data = await gymModel.updateOne(
      {
        _id,
      },
      {
        $pull: {
          _id: new Types.ObjectId(workoutId),
        },
      }
    );

    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

export default deleteWorkout;
