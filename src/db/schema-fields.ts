import { Schema } from "mongoose";

export type LocalizedText = {
  bn: string;
  en: string;
};

export const emptyLocalizedText = (): LocalizedText => ({ bn: "", en: "" });

export const localizedTextSchema = new Schema<LocalizedText>(
  {
    bn: { type: String, default: "", trim: true },
    en: { type: String, default: "", trim: true },
  },
  { _id: false },
);

export const mediaRefSchema = new Schema(
  {
    url: { type: String, default: "", trim: true },
    publicId: { type: String, default: "", trim: true },
    alt: { type: localizedTextSchema, default: emptyLocalizedText },
    width: { type: Number, default: 0, min: 0 },
    height: { type: Number, default: 0, min: 0 },
  },
  { _id: false },
);

export const seoSchema = new Schema(
  {
    title: { type: localizedTextSchema, default: emptyLocalizedText },
    description: { type: localizedTextSchema, default: emptyLocalizedText },
    keywords: { type: [String], default: [] },
    ogImageUrl: { type: String, default: "", trim: true },
  },
  { _id: false },
);

export const baseSchemaOptions = {
  timestamps: true,
  versionKey: false,
} as const;
