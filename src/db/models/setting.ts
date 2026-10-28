import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import {
  baseSchemaOptions,
  emptyLocalizedText,
  localizedTextSchema,
  mediaRefSchema,
  seoSchema,
} from "../schema-fields";

const siteSettingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "site" },
    siteName: { type: localizedTextSchema, default: emptyLocalizedText },
    shortName: { type: String, default: "KPESH", trim: true },
    tagline: { type: localizedTextSchema, default: emptyLocalizedText },
    logo: { type: mediaRefSchema, default: () => ({}) },
    backgroundVideo: {
      url: { type: String, default: "", trim: true },
      publicId: { type: String, default: "", trim: true },
      mimeType: { type: String, default: "", trim: true },
    },
    faviconUrl: { type: String, default: "", trim: true },
    theme: {
      navy: { type: String, default: "#092a32" },
      navy2: { type: String, default: "#0c3940" },
      brand: { type: String, default: "#9bd64a" },
      brandDark: { type: String, default: "#4d8d2a" },
    },
    contact: {
      phone: { type: String, default: "", trim: true },
      phoneAlt: { type: String, default: "", trim: true },
      email: { type: String, default: "", trim: true },
      whatsapp: { type: String, default: "", trim: true },
      address: { type: localizedTextSchema, default: emptyLocalizedText },
      mapUrl: { type: String, default: "", trim: true },
    },
    social: {
      facebook: { type: String, default: "", trim: true },
      youtube: { type: String, default: "", trim: true },
      instagram: { type: String, default: "", trim: true },
      linkedin: { type: String, default: "", trim: true },
    },
    seo: { type: seoSchema, default: () => ({}) },
    announcement: {
      enabled: { type: Boolean, default: false },
      text: { type: localizedTextSchema, default: emptyLocalizedText },
    },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  baseSchemaOptions,
);

export type SiteSetting = InferSchemaType<typeof siteSettingSchema>;

export const SiteSettingModel =
  (models.SiteSetting as Model<SiteSetting>) ??
  model<SiteSetting>("SiteSetting", siteSettingSchema);
