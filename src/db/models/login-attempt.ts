import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { baseSchemaOptions } from "../schema-fields";

const loginAttemptSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    attempts: { type: Number, required: true, min: 1 },
    windowEndsAt: { type: Date, required: true },
  },
  baseSchemaOptions,
);

loginAttemptSchema.index({ windowEndsAt: 1 }, { expireAfterSeconds: 0 });

export type LoginAttempt = InferSchemaType<typeof loginAttemptSchema>;

export const LoginAttemptModel =
  (models.LoginAttempt as Model<LoginAttempt>) ??
  model<LoginAttempt>("LoginAttempt", loginAttemptSchema);
