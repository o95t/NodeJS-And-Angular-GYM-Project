import { RequestHandler } from "express";

import gymModel, { IGym } from "../../models/gym.model";
import IResponse from "../../types/response.interface";

const getGyms: RequestHandler<unknown, IResponse<IGym[]>> = async (
  _req,
  res,
  next
) => {
  try {
    const gyms = await gymModel.find({});

    res.json({ success: true, data: gyms });
  } catch (e) {
    next(e);
  }
};

export default getGyms;
