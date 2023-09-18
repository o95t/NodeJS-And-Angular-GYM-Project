import { RequestHandler } from "express";
import { Types, UpdateWriteOpResult } from "mongoose";

import authModel from "../../models/auth.model";
import gymModel from "../../models/gym.model";
import IRequestBody from "../../types/request-body.interface";
import IResponse from "../../types/response.interface";
import IDeleteGymParams from "../types/delete-gym-params.interface";

const deleteGym: RequestHandler<
  IDeleteGymParams,
  IResponse<UpdateWriteOpResult>,
  IRequestBody
> = async (req, res, next) => {
  try {
    const { id, gymId } = req.params;
    const { tokenData } = req.body;
    const _id = new Types.ObjectId(id);
    const _gymId = new Types.ObjectId(gymId);

    const data = await authModel.updateOne(
      { _id },
      {
        $pull: {
          gyms: {
            _id: _gymId,
          },
        },
      }
    );

    await gymModel.updateOne(
      { _id: _gymId },
      {
        $pull: {
          members: {
            _id: new Types.ObjectId(tokenData._id),
          },
        },
      }
    );

    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

export default deleteGym;
