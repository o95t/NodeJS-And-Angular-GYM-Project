import { RequestHandler } from "express";
import { Types, UpdateWriteOpResult } from "mongoose";

import ErrorRequest from "../../error-request";
import gymModel from "../../models/gym.model";
import IResponse from "../../types/response.interface";
import ILogParams from "../types/logs-params.interface";

const deleteLog: RequestHandler<
  ILogParams,
  IResponse<UpdateWriteOpResult>
> = async (req, res, next) => {
  try {
    const { id, workoutId, logId } = req.params;
    const _id = new Types.ObjectId(id);
    const _logId = new Types.ObjectId(logId);

    const gym = await gymModel.findOne({ _id });

    if (!gym) {
      next(new ErrorRequest("Bad request", 400));
      return;
    }

    if (workoutId === gym.activeWorkout?._id.toString()) {
      await gymModel.updateOne(
        { _id },
        {
          $pull: {
            "activeWorkout.logs": {
              _id: new Types.ObjectId(_logId),
            },
          },
        }
      );
    }

    const data = await gymModel.updateOne(
      { _id, "workouts._id": new Types.ObjectId(workoutId) },
      {
        $pull: {
          "workouts.$.logs": {
            _id: new Types.ObjectId(_logId),
          },
        },
      }
    );

    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

export default deleteLog;
