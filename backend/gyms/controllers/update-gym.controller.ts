import { RequestHandler } from "express";
import { Types, UpdateWriteOpResult } from "mongoose";

import ErrorRequest from "../../error-request";
import gymModel from "../../models/gym.model";
import IResponse from "../../types/response.interface";
import IGymParams from "../types/gym-params.interface";
import IUpdateGymBody from "../types/update-gym-body.interface";

const updateGym: RequestHandler<
  IGymParams,
  IResponse<UpdateWriteOpResult>,
  IUpdateGymBody
> = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id, tokenData } = req.body;
    const gymId = new Types.ObjectId(id);

    const workouts = await gymModel.aggregate([
      {
        $match: {
          _id: gymId,
        },
      },
      {
        $unwind: "$workouts",
      },
      {
        $match: {
          "workouts._id": new Types.ObjectId(_id),
        },
      },
    ]);

    if (
      !workouts.length ||
      workouts[0].createdBy?.userId.toString() !== tokenData._id
    ) {
      next(new ErrorRequest("Bad request", 400));
      return;
    }

    const data = await gymModel.updateOne(
      {
        _id: gymId,
      },
      {
        $set: {
          activeWorkout: workouts[0].workouts,
        },
      }
    );

    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

export default updateGym;
