import { InferSchemaType, Schema } from "mongoose";

export const userSchema = new Schema({
  _id: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  avatar: String,
  gyms: [
    {
      _id: { type: String, required: true },
      name: { type: String, required: true },
      image: { type: String, required: true },
    },
  ],
});

export type IUser = InferSchemaType<typeof userSchema>;
