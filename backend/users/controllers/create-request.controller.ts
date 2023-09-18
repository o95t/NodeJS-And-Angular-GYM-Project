import { RequestHandler } from "express";
import { Types, UpdateWriteOpResult } from "mongoose";

import authModel from "../../models/auth.model";
import IResponse from "../../types/response.interface";
import ICreateRequestBody from "../types/create-request-body.interface";
import IRequestParams from "../types/request-params.interface";

const createRequest: RequestHandler<
  IRequestParams,
  IResponse<UpdateWriteOpResult>,
  ICreateRequestBody
> = async (req, res, next) => {
  try {
    const { _id, fullName, email, avatar, gyms, tokenData } = req.body;
    const currentUserId = new Types.ObjectId(req.params.id);

    await authModel.updateOne(
      { _id: currentUserId },
      {
        $push: {
          sentRequests: {
            _id,
            fullName,
            email,
            avatar,
          },
        },
      }
    );

    const data = await authModel.updateOne(
      { _id: new Types.ObjectId(_id) },
      {
        $push: {
          requests: {
            ...tokenData,
            _id: currentUserId,
          },
        },
      }
    );

    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

export default createRequest;
