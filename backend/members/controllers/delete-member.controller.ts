import { RequestHandler } from "express";
import { ObjectId } from "mongodb";
import { Types, UpdateWriteOpResult } from "mongoose";

import gymModel from "../../models/gym.model";
import IResponse from "../../types/response.interface";
import IMembersParams from "../types/members-params.interface";
import ErrorRequest from "../../error-request";

const deleteMember: RequestHandler<
  IMembersParams,
  IResponse<UpdateWriteOpResult>
> = async (req, res, next) => {
  try {
    const { id, memberId } = req.params;
    const { tokenData } = req.body;

    if (id !== tokenData._id) {
      next(new ErrorRequest("Unauthorized", 401));
      return;
    }

    const data = await gymModel.updateOne(
      { _id: new ObjectId(id) },
      {
        $pull: {
          members: {
            _id: new Types.ObjectId(memberId),
          },
        },
      }
    );

    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

export default deleteMember;
