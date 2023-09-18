import { RequestHandler } from "express";
import { Types, UpdateWriteOpResult } from "mongoose";

import authModel from "../../models/auth.model";
import IResponse from "../../types/response.interface";
import IRequestParams from "../types/request-params.interface";
import IUpdateRequestBody from "../types/update-request-body.interface";

const updateRequest: RequestHandler<
  IRequestParams,
  IResponse<UpdateWriteOpResult>,
  IUpdateRequestBody
> = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { isAccepted, _id, fullName, email, avatar, gyms, tokenData } =
      req.body;
    const currentUserId = new Types.ObjectId(id);
    if (isAccepted) {
      await authModel.updateOne(
        { _id: new Types.ObjectId(currentUserId) },
        {
          $push: {
            friends: {
              _id,
              fullName,
              email,
              avatar,
              gyms,
            },
          },
        }
      );

      await authModel.updateOne(
        { _id: new Types.ObjectId(_id) },
        {
          $push: {
            friends: {
              ...tokenData,
              _id: currentUserId,
            },
          },
        }
      );
    }

    await authModel.updateOne(
      { _id: new Types.ObjectId(_id) },
      {
        $pull: {
          sentRequests: {
            _id: currentUserId,
          },
        },
      }
    );

    const data = await authModel.updateOne(
      { _id: new Types.ObjectId(currentUserId) },
      {
        $pull: {
          requests: {
            _id,
          },
        },
      }
    );

    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

export default updateRequest;
