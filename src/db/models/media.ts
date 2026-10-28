import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { baseSchemaOptions, emptyLocalizedText, localizedTextSchema } from "../schema-fields";

export const mediaProviders = ["imagekit", "cloudinary", "external"] as const;

const mediaSchema = new Schema(
  {
    url: { type: String, required: true, trim: true },
    publicId: { type: String, default: "", trim: true },
    provider: { type: String, enum: mediaProviders, default: "imagekit" },
    alt: { type: localizedTextSchema, default: emptyLocalizedText },
    width: { type: Number, default: 0, min: 0 },
    height: { type: Number, default: 0, min: 0 },
    mimeType: { type: String, default: "", trim: true },
    size: { type: Number, default: 0, min: 0 },
    folder: { type: String, default: "kpesh", trim: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  baseSchemaOptions,
);

mediaSchema.index({ provider: 1, publicId: 1 });
mediaSchema.index({ createdAt: -1 });

export type Media = InferSchemaType<typeof mediaSchema>;
export type MediaProvider = (typeof mediaProviders)[number];

export const MediaModel = (models.Media as Model<Media>) ?? model<Media>("Media", mediaSchema);
