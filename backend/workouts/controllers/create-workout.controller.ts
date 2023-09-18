import { RequestHandler } from "express";
import { Types } from "mongoose";

import ErrorRequest from "../../error-request";
import IGymParams from "../../gyms/types/gym-params.interface";
import gymModel from "../../models/gym.model";
import IResponse from "../../types/response.interface";
import IFile from "../../users/types/file.interface";
import ICreateWorkoutBody from "../types/create-workout-body.interface";
import { IMAGES_URL } from "../../constants";

const createWorkout: RequestHandler<
  IGymParams,
  IResponse<{ _id: string; image: string }>,
  ICreateWorkoutBody
> = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, isActive, tokenData } = req.body;
    const { filename } = req["file"] as IFile;
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

    const workout = {
      _id: new Types.ObjectId(),
      name,
      description,
      image: IMAGES_URL + filename,
    };

    await gymModel.updateOne(
      {
        _id,
      },
      {
        $push: {
          workouts: workout,
        },
      }
    );

    if (isActive) {
      await gymModel.updateOne(
        {
          _id,
        },
        {
          $set: {
            activeWorkout: workout,
          },
        }
      );
    }

    res.json({
      success: true,
      data: { _id: workout._id.toString(), image: IMAGES_URL + filename },
    });
  } catch (e) {
    next(e);
  }
};

export default createWorkout;
