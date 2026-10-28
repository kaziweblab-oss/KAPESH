import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { baseSchemaOptions } from "../schema-fields";

export const userRoles = ["admin", "editor", "author"] as const;

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: userRoles, default: "editor" },
    isActive: { type: Boolean, default: true },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String, default: null, select: false },
    lastLoginAt: { type: Date, default: null },
  },
  baseSchemaOptions,
);

export type User = InferSchemaType<typeof userSchema>;
export type UserRole = (typeof userRoles)[number];

export const UserModel = (models.User as Model<User>) ?? model<User>("User", userSchema);
