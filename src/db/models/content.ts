import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import {
  baseSchemaOptions,
  emptyLocalizedText,
  localizedTextSchema,
  mediaRefSchema,
  seoSchema,
} from "../schema-fields";

const featureSchema = new Schema(
  {
    title: { type: localizedTextSchema, default: emptyLocalizedText },
    description: { type: localizedTextSchema, default: emptyLocalizedText },
  },
  { _id: false },
);

const serviceSchema = new Schema(
  {
    category: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    title: { type: localizedTextSchema, required: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    excerpt: { type: localizedTextSchema, default: emptyLocalizedText },
    content: { type: localizedTextSchema, default: emptyLocalizedText },
    cover: { type: mediaRefSchema, default: () => ({}) },
    gallery: { type: [mediaRefSchema], default: [] },
    features: { type: [featureSchema], default: [] },
    featured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    seo: { type: seoSchema, default: () => ({}) },
  },
  baseSchemaOptions,
);

serviceSchema.index({ category: 1, sortOrder: 1 });
serviceSchema.index({ featured: 1, isActive: 1 });

export type Service = InferSchemaType<typeof serviceSchema>;

export const ServiceModel =
  (models.Service as Model<Service>) ?? model<Service>("Service", serviceSchema);

const projectSchema = new Schema(
  {
    category: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    title: { type: localizedTextSchema, required: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    excerpt: { type: localizedTextSchema, default: emptyLocalizedText },
    content: { type: localizedTextSchema, default: emptyLocalizedText },
    cover: { type: mediaRefSchema, default: () => ({}) },
    gallery: { type: [mediaRefSchema], default: [] },
    location: { type: localizedTextSchema, default: emptyLocalizedText },
    capacity: { type: String, default: "", trim: true },
    client: { type: String, default: "", trim: true },
    completedAt: { type: Date, default: null },
    featured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    seo: { type: seoSchema, default: () => ({}) },
  },
  baseSchemaOptions,
);

projectSchema.index({ category: 1, sortOrder: 1 });
projectSchema.index({ featured: 1, isActive: 1 });

export type Project = InferSchemaType<typeof projectSchema>;

export const ProjectModel =
  (models.Project as Model<Project>) ?? model<Project>("Project", projectSchema);

const priceSchema = new Schema(
  {
    amount: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: "BDT", trim: true },
    showPrice: { type: Boolean, default: false },
    callForPrice: { type: Boolean, default: true },
  },
  { _id: false },
);

const specSchema = new Schema(
  {
    label: { type: localizedTextSchema, default: emptyLocalizedText },
    value: { type: String, default: "", trim: true },
  },
  { _id: false },
);

const productSchema = new Schema(
  {
    category: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    brand: { type: Schema.Types.ObjectId, ref: "Brand", default: null },
    title: { type: localizedTextSchema, required: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    excerpt: { type: localizedTextSchema, default: emptyLocalizedText },
    description: { type: localizedTextSchema, default: emptyLocalizedText },
    cover: { type: mediaRefSchema, default: () => ({}) },
    images: { type: [mediaRefSchema], default: [] },
    price: { type: priceSchema, default: () => ({}) },
    specs: { type: [specSchema], default: [] },
    features: { type: [featureSchema], default: [] },
    stockStatus: {
      type: String,
      enum: ["in_stock", "out_of_stock", "pre_order"],
      default: "in_stock",
    },
    featured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    seo: { type: seoSchema, default: () => ({}) },
  },
  baseSchemaOptions,
);

productSchema.index({ category: 1, sortOrder: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ featured: 1, isActive: 1 });

export type Product = InferSchemaType<typeof productSchema>;

export const ProductModel =
  (models.Product as Model<Product>) ?? model<Product>("Product", productSchema);

const testimonialSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: localizedTextSchema, default: emptyLocalizedText },
    quote: { type: localizedTextSchema, required: true },
    avatar: { type: mediaRefSchema, default: () => ({}) },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  baseSchemaOptions,
);

testimonialSchema.index({ isActive: 1, sortOrder: 1 });

export type Testimonial = InferSchemaType<typeof testimonialSchema>;

export const TestimonialModel =
  (models.Testimonial as Model<Testimonial>) ??
  model<Testimonial>("Testimonial", testimonialSchema);

const faqSchema = new Schema(
  {
    question: { type: localizedTextSchema, required: true },
    answer: { type: localizedTextSchema, required: true },
    category: { type: String, default: "", trim: true },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  baseSchemaOptions,
);

faqSchema.index({ isActive: 1, sortOrder: 1 });

export type Faq = InferSchemaType<typeof faqSchema>;

export const FaqModel = (models.Faq as Model<Faq>) ?? model<Faq>("Faq", faqSchema);

const postSchema = new Schema(
  {
    category: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    author: { type: Schema.Types.ObjectId, ref: "User", default: null },
    title: { type: localizedTextSchema, required: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    excerpt: { type: localizedTextSchema, default: emptyLocalizedText },
    content: { type: localizedTextSchema, default: emptyLocalizedText },
    cover: { type: mediaRefSchema, default: () => ({}) },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    publishedAt: { type: Date, default: null },
    seo: { type: seoSchema, default: () => ({}) },
  },
  baseSchemaOptions,
);

postSchema.index({ status: 1, publishedAt: -1 });
postSchema.index({ category: 1 });

export type Post = InferSchemaType<typeof postSchema>;

export const PostModel = (models.Post as Model<Post>) ?? model<Post>("Post", postSchema);
