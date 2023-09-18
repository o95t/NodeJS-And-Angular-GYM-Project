import { InferSchemaType, Schema, Types } from "mongoose";

export const logSchema = new Schema(
  {
    comment: { type: String, required: true },
    createdBy: {
      userId: { type: Types.ObjectId, required: true },
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      avatar: String,
    },
  },
  { timestamps: true, versionKey: false }
);

export type ILog = InferSchemaType<typeof logSchema>;
