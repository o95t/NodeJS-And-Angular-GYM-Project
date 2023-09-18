import { RequestHandler } from "express";
import { Types } from "mongoose";

import authModel from "../../models/auth.model";
import { IGym } from "../../models/gym.model";
import IResponse from "../../types/response.interface";
import IRequestParams from "../types/request-params.interface";

const getGyms: RequestHandler<IRequestParams, IResponse<IGym[]>> = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    const gyms = await authModel.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(id),
        },
      },
      { $unwind: "$gyms" },
      {
        $project: {
          _id: 0,
        },
      },
    ]);

    res.json({ success: true, data: gyms });
  } catch (e) {
    next(e);
  }
};

export default getGyms;
