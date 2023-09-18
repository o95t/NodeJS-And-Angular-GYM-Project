import { RequestHandler } from "express";
import { Types, UpdateWriteOpResult } from "mongoose";

import ErrorRequest from "../../error-request";
import authModel from "../../models/auth.model";
import IResponse from "../../types/response.interface";
import IFile from "../types/file.interface";
import IRequestParams from "../types/request-params.interface";
import { IMAGES_URL } from "../../constants";
import gymModel from "../../models/gym.model";
import IRequestBody from "../../types/request-body.interface";

const createAvatar: RequestHandler<
  IRequestParams,
  IResponse<string>,
  IRequestBody
> = async (req, res, next) => {
  try {
    if (!req["file"]) {
      next(new ErrorRequest("Bad request", 400));
    }
    const { tokenData } = req.body;
    const { filename } = req["file"] as IFile;

    await authModel.updateOne(
      { _id: new Types.ObjectId(req.params.id) },
      {
        $set: {
          avatar: IMAGES_URL + filename,
        },
      }
    );

    await authModel.updateMany(
      { "friends._id": tokenData._id },
      {
        $set: {
          "friends.$.avatar": IMAGES_URL + filename,
        },
      }
    );

    await authModel.updateMany(
      { "requests._id": tokenData._id },
      {
        $set: {
          "requests.$.avatar": IMAGES_URL + filename,
        },
      }
    );

    await authModel.updateMany(
      { "sentRequests._id": tokenData._id },
      {
        $set: {
          "sentRequests.$.avatar": IMAGES_URL + filename,
        },
      }
    );

    await gymModel.updateMany(
      { "members._id": tokenData._id },
      {
        $set: {
          "members.$.avatar": IMAGES_URL + filename,
        },
      }
    );

    res.json({ success: true, data: IMAGES_URL + filename });
  } catch (e) {
    next(e);
  }
};

export default createAvatar;
