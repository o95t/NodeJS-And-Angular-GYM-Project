import { InferSchemaType, Schema, Types } from "mongoose";
import { logSchema } from "./log.model";

export const workoutSchema = new Schema({
  _id: { type: Types.ObjectId, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  logs: [logSchema],
});

export type IWorkout = InferSchemaType<typeof workoutSchema>;
