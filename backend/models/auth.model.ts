import { Schema, model, InferSchemaType } from "mongoose";
import { userSchema } from "./user.model";

export const authModel = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    avatar: String,
    requests: [userSchema],
    sentRequests: [userSchema],
    friends: [userSchema],
    gyms: [
      {
        _id: { type: String, required: true },
        name: { type: String, required: true },
        image: { type: String, required: true },
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

export type IAuth = InferSchemaType<typeof authModel>;

export default model<IAuth>("auth", authModel);
