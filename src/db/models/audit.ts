import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { baseSchemaOptions } from "../schema-fields";

const auditLogSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", default: null },
    action: { type: String, required: true, trim: true },
    collectionName: { type: String, required: true, trim: true },
    documentId: { type: String, default: "", trim: true },
    before: { type: Schema.Types.Mixed, default: null },
    after: { type: Schema.Types.Mixed, default: null },
    ipHash: { type: String, default: "", trim: true },
  },
  { ...baseSchemaOptions, updatedAt: false },
);

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ user: 1, createdAt: -1 });

export type AuditLog = InferSchemaType<typeof auditLogSchema>;

export const AuditLogModel =
  (models.AuditLog as Model<AuditLog>) ?? model<AuditLog>("AuditLog", auditLogSchema);
