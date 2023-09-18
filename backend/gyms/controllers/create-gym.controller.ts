import { RequestHandler } from "express";
import { Types } from "mongoose";

import ErrorRequest from "../../error-request";
import gymModel, { IGym } from "../../models/gym.model";
import IResponse from "../../types/response.interface";
import IFile from "../../users/types/file.interface";
import ICreateGymBody from "../types/create-gym-body.interface";
import { IMAGES_URL } from "../../constants";
import authModel from "../../models/auth.model";

const createGym: RequestHandler<
  unknown,
  IResponse<IGym>,
  ICreateGymBody
> = async (req, res, next) => {
  try {
    const { name, tokenData } = req.body;
    if (!req["file"] || !name) {
      next(new ErrorRequest("Bad request", 400));
      return;
    }
    const { filename } = req["file"] as IFile;

    const gym = await gymModel.create({
      _id: new Types.ObjectId(),
      name,
      image: IMAGES_URL + filename,
      createdBy: {
        userId: new Types.ObjectId(tokenData._id),
        fullName: tokenData.fullName,
        email: tokenData.email,
        avatar: tokenData.avatar,
      },
      members: [tokenData],
      workouts: [],
    });

    await authModel.updateOne(
      { _id: new Types.ObjectId(tokenData._id) },
      {
        $push: {
          gyms: gym,
        },
      }
    );

    res.json({ success: true, data: gym });
  } catch (e) {
    next(e);
  }
};

export default createGym;
