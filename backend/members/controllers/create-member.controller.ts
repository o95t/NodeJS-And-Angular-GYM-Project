import { RequestHandler } from "express";
import { ObjectId } from "mongodb";
import { Types, UpdateWriteOpResult } from "mongoose";

import ErrorRequest from "../../error-request";
import IGymParams from "../../gyms/types/gym-params.interface";
import gymModel from "../../models/gym.model";
import IResponse from "../../types/response.interface";
import ICreateMemberBody from "../types/create-member-body.interface";

const createMember: RequestHandler<
  IGymParams,
  IResponse<UpdateWriteOpResult>,
  ICreateMemberBody
> = async (req, res, next) => {
  try {
    const { _id, fullName, email, avatar, gyms, tokenData } = req.body;

    if (_id !== tokenData._id) {
      next(new ErrorRequest("Unauthorized", 401));
      return;
    }

    const data = await gymModel.updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $push: {
          members: {
            _id: new Types.ObjectId(_id),
            fullName,
            email,
            avatar,
            gyms,
          },
        },
      }
    );

    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

export default createMember;
