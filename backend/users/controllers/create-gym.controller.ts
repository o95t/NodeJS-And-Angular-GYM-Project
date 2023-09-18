import { RequestHandler } from "express";
import { Types, UpdateWriteOpResult } from "mongoose";

import authModel from "../../models/auth.model";
import IResponse from "../../types/response.interface";
import ICreateGymBody from "../types/create-gym.body.interface";
import IRequestParams from "../types/request-params.interface";
import gymModel from "../../models/gym.model";
import ErrorRequest from "../../error-request";

const createGym: RequestHandler<
  IRequestParams,
  IResponse<UpdateWriteOpResult>,
  ICreateGymBody
> = async (req, res, next) => {
  try {
    const { _id, name, image, tokenData } = req.body;
    const currentUserId = new Types.ObjectId(req.params.id);

    const gym = await gymModel.findOne({
      _id: new Types.ObjectId(_id.toString()),
      "members._id": tokenData._id,
    });

    if (gym) {
      throw new ErrorRequest("User already joined!", 400);
    }

    const data = await authModel.updateOne(
      { _id: currentUserId },
      {
        $push: {
          gyms: {
            _id,
            name,
            image,
          },
        },
      }
    );

    await gymModel.updateOne(
      { _id: new Types.ObjectId(_id.toString()) },
      {
        $push: {
          members: {
            _id: tokenData._id,
            fullName: tokenData.fullName,
            email: tokenData.email,
            avatar: tokenData.avatar,
          },
        },
      }
    );

    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

export default createGym;
