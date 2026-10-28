import {
  CategoryModel,
  FaqModel,
  NavigationModel,
  PostModel,
  ProductModel,
  ProjectModel,
  ServiceModel,
  TestimonialModel,
} from "@/db/models";
import { connectToDatabase } from "@/db/connection";
import { requireRole, type UserRole } from "@/lib/auth";
import { getAdminLocale } from "@/lib/admin-i18n";
import { ContentManager, type AdminResource } from "./content-manager";

type AdminDocument = Record<string, unknown> & { _id: string };

const roles: Record<AdminResource, readonly UserRole[]> = {
  services: ["admin", "editor"],
  projects: ["admin", "editor"],
  products: ["admin", "editor"],
  blog: ["admin", "editor", "author"],
  categories: ["admin", "editor"],
  testimonials: ["admin", "editor"],
  faqs: ["admin", "editor"],
  navigation: ["admin"],
};

async function getDocuments(resource: AdminResource) {
  const sort = { sortOrder: 1, createdAt: -1 } as const;
  switch (resource) {
    case "services": return ServiceModel.find({}).sort(sort).limit(200).lean();
    case "projects": return ProjectModel.find({}).sort(sort).limit(200).lean();
    case "products": return ProductModel.find({}).sort(sort).limit(200).lean();
    case "blog": return PostModel.find({}).sort({ createdAt: -1 }).limit(200).lean();
    case "categories": return CategoryModel.find({}).sort(sort).limit(200).lean();
    case "testimonials": return TestimonialModel.find({}).sort(sort).limit(200).lean();
    case "faqs": return FaqModel.find({}).sort(sort).limit(200).lean();
    case "navigation": return NavigationModel.find({}).sort(sort).limit(200).lean();
  }
}

export async function AdminContentPage({ resource }: { resource: AdminResource }) {
  await requireRole(roles[resource]);
  await connectToDatabase();
  const documents = await getDocuments(resource);
  const items = JSON.parse(JSON.stringify(documents)) as AdminDocument[];
  const locale = await getAdminLocale();
  return <ContentManager resource={resource} items={items} locale={locale} />;
}
