import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import { sign } from "jsonwebtoken";

import ErrorRequest from "../../error-request";
import authModel from "../../models/auth.model";
import IResponse from "../../types/response.interface";
import ISignUpBody from "../types/sign-up-body.interface";

const signUp: RequestHandler<unknown, IResponse<string>, ISignUpBody> = async (
  req,
  res,
  next
) => {
  try {
    const { fullName, email, password } = req.body;
    const user = await authModel
      .findOne({ email: email })
      .collation({ locale: "en", strength: 2 });

    if (user) {
      throw new ErrorRequest("Email is already signed up", 422);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await authModel.create({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const token = sign(
      {
        _id: newUser._id,
        fullName,
        email: newUser.email,
        avatar: newUser.avatar,
        gyms: newUser.gyms,
      },
      process.env.JWT_SECRET!
    );
    res.json({ success: true, data: token });
  } catch (e) {
    next(e);
  }
};

export default signUp;
