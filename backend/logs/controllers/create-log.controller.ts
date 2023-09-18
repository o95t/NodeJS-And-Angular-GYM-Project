import { RequestHandler } from "express";
import { Types, UpdateWriteOpResult } from "mongoose";

import ErrorRequest from "../../error-request";
import gymModel from "../../models/gym.model";
import IResponse from "../../types/response.interface";
import IWorkoutParams from "../../workouts/types/workouts-params.interface";
import ICreateLogBody from "../types/create-log-body.interface";

const createLog: RequestHandler<
  IWorkoutParams,
  IResponse<string>,
  ICreateLogBody
> = async (req, res, next) => {
  try {
    const { id, workoutId } = req.params;
    const { comment, tokenData } = req.body;
    const _id = new Types.ObjectId(id);

    const gym = await gymModel.findOne({ _id });

    if (!gym) {
      next(new ErrorRequest("Bad request", 400));
      return;
    }

    const log = {
      _id: new Types.ObjectId(),
      comment,
      createdBy: {
        userId: new Types.ObjectId(tokenData._id),
        fullName: tokenData.fullName,
        email: tokenData.email,
        avatar: tokenData.avatar,
      },
    };

    if (workoutId === gym.activeWorkout?._id.toString()) {
      await gymModel.updateOne(
        { _id },
        {
          $push: {
            "activeWorkout.logs": log,
          },
        }
      );
    }

    await gymModel.updateOne(
      { _id, "workouts._id": new Types.ObjectId(workoutId) },
      {
        $push: {
          "workouts.$.logs": log,
        },
      }
    );

    res.json({ success: true, data: log._id.toString() });
  } catch (e) {
    next(e);
  }
};

export default createLog;
