import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import { sign } from "jsonwebtoken";

import ErrorRequest from "../../error-request";
import authModel from "../../models/auth.model";
import IResponse from "../../types/response.interface";
import ISignInBody from "../types/sign-in-body.interface";

const signIn: RequestHandler<unknown, IResponse<string>, ISignInBody> = async (
  req,
  res,
  next
) => {
  try {
    const { email, password } = req.body;
    const user = await authModel
      .findOne({ email })
      .collation({ locale: "en", strength: 2 });

    if (!user) {
      throw new ErrorRequest("Invalid credentials", 401);
    }

    bcrypt.compare(password, user.password, (err, isValid) => {
      if (isValid) {
        const token = sign(
          {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            avatar: user.avatar,
            gyms: user.gyms,
          },
          process.env.JWT_SECRET!
        );
        res.json({ success: true, data: token });
      } else {
        next(new ErrorRequest("Invalid credentials", 401));
      }
    });
  } catch (e) {
    next(e);
  }
};

export default signIn;
