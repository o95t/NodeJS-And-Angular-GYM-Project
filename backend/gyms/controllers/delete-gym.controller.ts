import { RequestHandler } from "express";
import { ObjectId } from "mongodb";
import { UpdateWriteOpResult } from "mongoose";

import ErrorRequest from "../../error-request";
import authModel from "../../models/auth.model";
import gymModel from "../../models/gym.model";
import IRequestBody from "../../types/request-body.interface";
import IResponse from "../../types/response.interface";
import IGymParams from "../types/gym-params.interface";

const deleteGym: RequestHandler<
  IGymParams,
  IResponse<UpdateWriteOpResult>,
  IRequestBody
> = async (req, res, next) => {
  const { tokenData } = req.body;
  try {
    const { id } = req.params;
    const _id = new ObjectId(id);
    const gym = await gymModel.findOne({ _id });

    if (gym?.createdBy?.userId.toString() !== tokenData._id) {
      next(new ErrorRequest("Unauthorized", 401));
      return;
    }

    await gymModel.deleteOne({ _id });

    const data = await authModel.updateMany(
      {},
      {
        $pull: {
          gyms: {
            _id: id,
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
