import { connectToDatabase } from "./connection";
import {
  BrandModel,
  CategoryModel,
  ContentBlockModel,
  FaqModel,
  NavigationModel,
  PostModel,
  ProductModel,
  ProjectModel,
  ServiceModel,
  SiteSettingModel,
  TestimonialModel,
  type CategoryKind,
  type NavigationLocation,
} from "./models";

export async function getSiteSettings() {
  await connectToDatabase();
  return SiteSettingModel.findOne({ key: "site" }).lean();
}

export async function getNavigation(location: NavigationLocation = "header") {
  await connectToDatabase();
  return NavigationModel.find({ location, isActive: true }).sort({ sortOrder: 1 }).lean();
}

export async function getContentBlock(key: string) {
  await connectToDatabase();
  return ContentBlockModel.findOne({ key, isActive: true }).lean();
}

export async function getCategories(kind?: CategoryKind) {
  await connectToDatabase();
  const filter = kind ? { kind, isActive: true } : { isActive: true };
  return CategoryModel.find(filter).sort({ kind: 1, sortOrder: 1 }).lean();
}

export async function getBrands() {
  await connectToDatabase();
  return BrandModel.find({ isActive: true }).sort({ sortOrder: 1 }).lean();
}

export async function getServices(limit = 50) {
  await connectToDatabase();
  return ServiceModel.find({ isActive: true })
    .sort({ featured: -1, sortOrder: 1 })
    .limit(limit)
    .lean();
}

export async function getServiceBySlug(slug: string, includeInactive = false) {
  await connectToDatabase();
  const filter = includeInactive ? { slug } : { slug, isActive: true };
  return ServiceModel.findOne(filter).lean();
}

export async function getProjects(limit = 50) {
  await connectToDatabase();
  return ProjectModel.find({ isActive: true })
    .sort({ featured: -1, sortOrder: 1 })
    .limit(limit)
    .lean();
}

export async function getProjectBySlug(slug: string, includeInactive = false) {
  await connectToDatabase();
  const filter = includeInactive ? { slug } : { slug, isActive: true };
  return ProjectModel.findOne(filter).lean();
}

export async function getProducts(limit = 50) {
  await connectToDatabase();
  return ProductModel.find({ isActive: true })
    .sort({ featured: -1, sortOrder: 1 })
    .limit(limit)
    .lean();
}

export async function getProductBySlug(slug: string, includeInactive = false) {
  await connectToDatabase();
  const filter = includeInactive ? { slug } : { slug, isActive: true };
  return ProductModel.findOne(filter).lean();
}

export async function getPosts(limit = 50) {
  await connectToDatabase();
  return PostModel.find({ status: "published" })
    .sort({ publishedAt: -1, createdAt: -1 })
    .limit(limit)
    .lean();
}

export async function getPostBySlug(slug: string, includeDrafts = false) {
  await connectToDatabase();

  if (includeDrafts) {
    return PostModel.findOne({ slug }).lean();
  }

  return PostModel.findOne({ slug, status: "published" }).lean();
}

export async function getTestimonials(limit = 20) {
  await connectToDatabase();
  return TestimonialModel.find({ isActive: true }).sort({ sortOrder: 1 }).limit(limit).lean();
}

export async function getFaqs(limit = 50) {
  await connectToDatabase();
  return FaqModel.find({ isActive: true }).sort({ sortOrder: 1 }).limit(limit).lean();
}
