import { Types, InferSchemaType, Schema, model } from "mongoose";
import { userSchema } from "./user.model";
import { workoutSchema } from "./workout.model";

const gymSchema = new Schema(
  {
    _id: { type: Types.ObjectId, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    createdBy: {
      userId: { type: Types.ObjectId, required: true },
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      avatar: String,
    },
    members: [userSchema],
    workouts: [workoutSchema],
    activeWorkout: workoutSchema,
  },
  { timestamps: true, versionKey: false }
);

export type IGym = InferSchemaType<typeof gymSchema>;

export default model<IGym>("gym", gymSchema);
