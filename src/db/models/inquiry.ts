import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { baseSchemaOptions } from "../schema-fields";

export const inquiryStatuses = ["new", "read", "replied", "archived"] as const;
export const inquirySources = ["contact", "quote", "product", "service"] as const;

const inquirySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, default: "", trim: true, lowercase: true },
    service: { type: String, default: "", trim: true },
    message: { type: String, required: true, trim: true },
    source: { type: String, enum: inquirySources, default: "contact" },
    status: { type: String, enum: inquiryStatuses, default: "new" },
    notes: { type: String, default: "", trim: true },
    ipHash: { type: String, default: "", trim: true },
    userAgent: { type: String, default: "", trim: true },
  },
  baseSchemaOptions,
);

inquirySchema.index({ status: 1, createdAt: -1 });
inquirySchema.index({ createdAt: -1 });

export type Inquiry = InferSchemaType<typeof inquirySchema>;
export type InquiryStatus = (typeof inquiryStatuses)[number];
export type InquirySource = (typeof inquirySources)[number];

export const InquiryModel =
  (models.Inquiry as Model<Inquiry>) ?? model<Inquiry>("Inquiry", inquirySchema);
