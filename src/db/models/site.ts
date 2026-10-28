import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import {
  baseSchemaOptions,
  emptyLocalizedText,
  localizedTextSchema,
  mediaRefSchema,
} from "../schema-fields";

export const navigationLocations = ["header", "footer", "mobile"] as const;

const navigationSchema = new Schema(
  {
    label: { type: localizedTextSchema, required: true },
    href: { type: String, required: true, trim: true },
    location: { type: String, enum: navigationLocations, default: "header" },
    parent: { type: Schema.Types.ObjectId, ref: "Navigation", default: null },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    openInNewTab: { type: Boolean, default: false },
  },
  baseSchemaOptions,
);

navigationSchema.index({ location: 1, sortOrder: 1 });
navigationSchema.index({ parent: 1 });

export type Navigation = InferSchemaType<typeof navigationSchema>;
export type NavigationLocation = (typeof navigationLocations)[number];

export const NavigationModel =
  (models.Navigation as Model<Navigation>) ?? model<Navigation>("Navigation", navigationSchema);

export const contentBlockTypes = ["hero", "about", "cta", "footer", "custom"] as const;

const contentBlockSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    type: { type: String, enum: contentBlockTypes, default: "custom" },
    title: { type: localizedTextSchema, default: emptyLocalizedText },
    content: { type: localizedTextSchema, default: emptyLocalizedText },
    image: { type: mediaRefSchema, default: () => ({}) },
    data: { type: Schema.Types.Mixed, default: {} },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  baseSchemaOptions,
);

contentBlockSchema.index({ type: 1, sortOrder: 1 });

export type ContentBlock = InferSchemaType<typeof contentBlockSchema>;
export type ContentBlockType = (typeof contentBlockTypes)[number];

export const ContentBlockModel =
  (models.ContentBlock as Model<ContentBlock>) ??
  model<ContentBlock>("ContentBlock", contentBlockSchema);
