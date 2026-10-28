import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import {
  baseSchemaOptions,
  emptyLocalizedText,
  localizedTextSchema,
  mediaRefSchema,
} from "../schema-fields";

export const categoryKinds = ["service", "project", "product", "post"] as const;

const categorySchema = new Schema(
  {
    kind: { type: String, enum: categoryKinds, required: true },
    name: { type: localizedTextSchema, required: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    description: { type: localizedTextSchema, default: emptyLocalizedText },
    image: { type: mediaRefSchema, default: () => ({}) },
    icon: { type: String, default: "", trim: true },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  baseSchemaOptions,
);

categorySchema.index({ kind: 1, slug: 1 }, { unique: true });
categorySchema.index({ kind: 1, sortOrder: 1 });

export type Category = InferSchemaType<typeof categorySchema>;
export type CategoryKind = (typeof categoryKinds)[number];

export const CategoryModel =
  (models.Category as Model<Category>) ?? model<Category>("Category", categorySchema);

const brandSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    logoUrl: { type: String, default: "", trim: true },
    website: { type: String, default: "", trim: true },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  baseSchemaOptions,
);

brandSchema.index({ sortOrder: 1 });

export type Brand = InferSchemaType<typeof brandSchema>;

export const BrandModel = (models.Brand as Model<Brand>) ?? model<Brand>("Brand", brandSchema);
