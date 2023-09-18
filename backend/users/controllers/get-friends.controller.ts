import { RequestHandler } from "express";
import { Types } from "mongoose";

import authModel from "../../models/auth.model";
import { IUser } from "../../models/user.model";
import IResponse from "../../types/response.interface";
import IRequestParams from "../types/request-params.interface";

const getFriends: RequestHandler<IRequestParams, IResponse<IUser[]>> = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    const friends = await authModel.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(id),
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);

    res.json({ success: true, data: friends.length ? friends[0].friends : [] });
  } catch (e) {
    next(e);
  }
};

export default getFriends;
