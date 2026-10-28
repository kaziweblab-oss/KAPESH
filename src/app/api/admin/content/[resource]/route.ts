import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/db/connection";
import {
  AuditLogModel,
  CategoryModel,
  FaqModel,
  NavigationModel,
  PostModel,
  ProductModel,
  ProjectModel,
  ServiceModel,
  TestimonialModel,
} from "@/db/models";
import { requireRole, type UserRole } from "@/lib/auth";
import { rejectCrossOriginMutation } from "@/lib/security";
import { repairMojibakeDeep } from "@/lib/text-encoding";
import { localizedTextSchema, slugSchema } from "@/lib/validations/common";

const localized = localizedTextSchema;
const mediaRef = z.object({
  url: z.string().trim().max(2048).default(""),
  publicId: z.string().trim().max(200).default(""),
  alt: localized.default({ bn: "", en: "" }),
  width: z.coerce.number().int().min(0).max(100_000).default(0),
  height: z.coerce.number().int().min(0).max(100_000).default(0),
});
const orderedActive = {
  sortOrder: z.coerce.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
};

const serviceSchema = z.object({
  title: localized,
  slug: slugSchema,
  excerpt: localized.default({ bn: "", en: "" }),
  content: localized.default({ bn: "", en: "" }),
  cover: mediaRef.default({ url: "", publicId: "", alt: { bn: "", en: "" }, width: 0, height: 0 }),
  featured: z.boolean().default(false),
  ...orderedActive,
});
const projectSchema = z.object({
  title: localized,
  slug: slugSchema,
  excerpt: localized.default({ bn: "", en: "" }),
  content: localized.default({ bn: "", en: "" }),
  cover: mediaRef.default({ url: "", publicId: "", alt: { bn: "", en: "" }, width: 0, height: 0 }),
  gallery: z.array(mediaRef).max(30).default([]),
  location: localized.default({ bn: "", en: "" }),
  capacity: z.string().trim().max(120).default(""),
  client: z.string().trim().max(120).default(""),
  featured: z.boolean().default(false),
  ...orderedActive,
});
const productSchema = z.object({
  title: localized,
  slug: slugSchema,
  excerpt: localized.default({ bn: "", en: "" }),
  description: localized.default({ bn: "", en: "" }),
  cover: mediaRef.default({ url: "", publicId: "", alt: { bn: "", en: "" }, width: 0, height: 0 }),
  images: z.array(mediaRef).max(30).default([]),
  specs: z
    .array(z.object({ label: localized, value: z.string().trim().max(300) }))
    .max(50)
    .default([]),
  price: z.object({
    amount: z.coerce.number().min(0).default(0),
    currency: z.string().trim().max(8).default("BDT"),
    showPrice: z.boolean().default(false),
    callForPrice: z.boolean().default(true),
  }),
  stockStatus: z.enum(["in_stock", "out_of_stock", "pre_order"]).default("in_stock"),
  featured: z.boolean().default(false),
  ...orderedActive,
});
const blogSchema = z.object({
  title: localized,
  slug: slugSchema,
  excerpt: localized.default({ bn: "", en: "" }),
  content: localized.default({ bn: "", en: "" }),
  cover: mediaRef.default({ url: "", publicId: "", alt: { bn: "", en: "" }, width: 0, height: 0 }),
  tags: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
  status: z.enum(["draft", "published"]).default("draft"),
});
const categorySchema = z.object({
  kind: z.enum(["service", "project", "product", "post"]),
  name: localized,
  slug: slugSchema,
  description: localized.default({ bn: "", en: "" }),
  ...orderedActive,
});
const testimonialSchema = z.object({
  name: z.string().trim().min(2).max(120),
  role: localized.default({ bn: "", en: "" }),
  quote: localized,
  rating: z.coerce.number().int().min(1).max(5).default(5),
  ...orderedActive,
});
const faqSchema = z.object({
  question: localized,
  answer: localized,
  category: z.string().trim().max(80).default(""),
  ...orderedActive,
});
const navigationSchema = z.object({
  label: localized,
  href: z.string().trim().min(1).max(300),
  location: z.enum(["header", "footer", "mobile"]).default("header"),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  openInNewTab: z.boolean().default(false),
});

const resourceRoles = {
  services: ["admin", "editor"],
  projects: ["admin", "editor"],
  products: ["admin", "editor"],
  blog: ["admin", "editor", "author"],
  categories: ["admin", "editor"],
  testimonials: ["admin", "editor"],
  faqs: ["admin", "editor"],
  navigation: ["admin"],
} as const satisfies Record<string, readonly UserRole[]>;

type Resource = keyof typeof resourceRoles;
type CreateContent =
  | { resource: "services"; data: z.infer<typeof serviceSchema> }
  | { resource: "projects"; data: z.infer<typeof projectSchema> }
  | { resource: "products"; data: z.infer<typeof productSchema> }
  | { resource: "blog"; data: z.infer<typeof blogSchema> }
  | { resource: "categories"; data: z.infer<typeof categorySchema> }
  | { resource: "testimonials"; data: z.infer<typeof testimonialSchema> }
  | { resource: "faqs"; data: z.infer<typeof faqSchema> }
  | { resource: "navigation"; data: z.infer<typeof navigationSchema> };
type UpdateContent =
  | { resource: "services"; data: Partial<z.infer<typeof serviceSchema>> }
  | { resource: "projects"; data: Partial<z.infer<typeof projectSchema>> }
  | { resource: "products"; data: Partial<z.infer<typeof productSchema>> }
  | { resource: "blog"; data: Partial<z.infer<typeof blogSchema>> }
  | { resource: "categories"; data: Partial<z.infer<typeof categorySchema>> }
  | { resource: "testimonials"; data: Partial<z.infer<typeof testimonialSchema>> }
  | { resource: "faqs"; data: Partial<z.infer<typeof faqSchema>> }
  | { resource: "navigation"; data: Partial<z.infer<typeof navigationSchema>> };
type ParseResult<T> = { success: true; data: T } | { success: false; message: string };

function isResource(value: string): value is Resource {
  return value in resourceRoles;
}

function parseResult<T>(
  result:
    | {
        success: true;
        data: T;
      }
    | {
        success: false;
        error: z.ZodError;
      },
): ParseResult<T> {
  return result.success
    ? result
    : { success: false, message: result.error.issues[0]?.message ?? "Invalid content." };
}

function parseCreate(resource: Resource, body: unknown): ParseResult<CreateContent> {
  switch (resource) {
    case "services": {
      const result = parseResult(serviceSchema.safeParse(body));
      return result.success ? { success: true, data: { resource, data: result.data } } : result;
    }
    case "projects": {
      const result = parseResult(projectSchema.safeParse(body));
      return result.success ? { success: true, data: { resource, data: result.data } } : result;
    }
    case "products": {
      const result = parseResult(productSchema.safeParse(body));
      return result.success ? { success: true, data: { resource, data: result.data } } : result;
    }
    case "blog": {
      const result = parseResult(blogSchema.safeParse(body));
      return result.success ? { success: true, data: { resource, data: result.data } } : result;
    }
    case "categories": {
      const result = parseResult(categorySchema.safeParse(body));
      return result.success ? { success: true, data: { resource, data: result.data } } : result;
    }
    case "testimonials": {
      const result = parseResult(testimonialSchema.safeParse(body));
      return result.success ? { success: true, data: { resource, data: result.data } } : result;
    }
    case "faqs": {
      const result = parseResult(faqSchema.safeParse(body));
      return result.success ? { success: true, data: { resource, data: result.data } } : result;
    }
    case "navigation": {
      const result = parseResult(navigationSchema.safeParse(body));
      return result.success ? { success: true, data: { resource, data: result.data } } : result;
    }
  }
}

function parseUpdate(resource: Resource, body: unknown): ParseResult<UpdateContent> {
  switch (resource) {
    case "services": {
      const result = parseResult(serviceSchema.partial().safeParse(body));
      return result.success ? { success: true, data: { resource, data: result.data } } : result;
    }
    case "projects": {
      const result = parseResult(projectSchema.partial().safeParse(body));
      return result.success ? { success: true, data: { resource, data: result.data } } : result;
    }
    case "products": {
      const result = parseResult(productSchema.partial().safeParse(body));
      return result.success ? { success: true, data: { resource, data: result.data } } : result;
    }
    case "blog": {
      const result = parseResult(blogSchema.partial().safeParse(body));
      return result.success ? { success: true, data: { resource, data: result.data } } : result;
    }
    case "categories": {
      const result = parseResult(categorySchema.partial().safeParse(body));
      return result.success ? { success: true, data: { resource, data: result.data } } : result;
    }
    case "testimonials": {
      const result = parseResult(testimonialSchema.partial().safeParse(body));
      return result.success ? { success: true, data: { resource, data: result.data } } : result;
    }
    case "faqs": {
      const result = parseResult(faqSchema.partial().safeParse(body));
      return result.success ? { success: true, data: { resource, data: result.data } } : result;
    }
    case "navigation": {
      const result = parseResult(navigationSchema.partial().safeParse(body));
      return result.success ? { success: true, data: { resource, data: result.data } } : result;
    }
  }
}

async function getDocuments(resource: Resource) {
  const query = { sortOrder: 1, createdAt: -1 } as const;
  switch (resource) {
    case "services":
      return ServiceModel.find({}).sort(query).limit(200).lean();
    case "projects":
      return ProjectModel.find({}).sort(query).limit(200).lean();
    case "products":
      return ProductModel.find({}).sort(query).limit(200).lean();
    case "blog":
      return PostModel.find({}).sort({ createdAt: -1 }).limit(200).lean();
    case "categories":
      return CategoryModel.find({}).sort(query).limit(200).lean();
    case "testimonials":
      return TestimonialModel.find({}).sort(query).limit(200).lean();
    case "faqs":
      return FaqModel.find({}).sort(query).limit(200).lean();
    case "navigation":
      return NavigationModel.find({}).sort(query).limit(200).lean();
  }
}

async function createDocument(content: CreateContent, userId: string) {
  switch (content.resource) {
    case "services":
      return ServiceModel.create(content.data);
    case "projects":
      return ProjectModel.create(content.data);
    case "products":
      return ProductModel.create(content.data);
    case "blog":
      return PostModel.create({
        ...content.data,
        author: userId,
        publishedAt: content.data.status === "published" ? new Date() : null,
      });
    case "categories":
      return CategoryModel.create(content.data);
    case "testimonials":
      return TestimonialModel.create(content.data);
    case "faqs":
      return FaqModel.create(content.data);
    case "navigation":
      return NavigationModel.create(content.data);
  }
}

async function findDocument(resource: Resource, id: string) {
  switch (resource) {
    case "services":
      return ServiceModel.findById(id).lean();
    case "projects":
      return ProjectModel.findById(id).lean();
    case "products":
      return ProductModel.findById(id).lean();
    case "blog":
      return PostModel.findById(id).lean();
    case "categories":
      return CategoryModel.findById(id).lean();
    case "testimonials":
      return TestimonialModel.findById(id).lean();
    case "faqs":
      return FaqModel.findById(id).lean();
    case "navigation":
      return NavigationModel.findById(id).lean();
  }
}

async function updateDocument(resource: Resource, id: string, content: UpdateContent) {
  switch (content.resource) {
    case "services":
      return ServiceModel.findByIdAndUpdate(
        id,
        { $set: content.data },
        { new: true, runValidators: true },
      );
    case "projects":
      return ProjectModel.findByIdAndUpdate(
        id,
        { $set: content.data },
        { new: true, runValidators: true },
      );
    case "products":
      return ProductModel.findByIdAndUpdate(
        id,
        { $set: content.data },
        { new: true, runValidators: true },
      );
    case "blog": {
      const values =
        content.data.status === "published"
          ? { ...content.data, publishedAt: new Date() }
          : content.data;
      return PostModel.findByIdAndUpdate(id, { $set: values }, { new: true, runValidators: true });
    }
    case "categories":
      return CategoryModel.findByIdAndUpdate(
        id,
        { $set: content.data },
        { new: true, runValidators: true },
      );
    case "testimonials":
      return TestimonialModel.findByIdAndUpdate(
        id,
        { $set: content.data },
        { new: true, runValidators: true },
      );
    case "faqs":
      return FaqModel.findByIdAndUpdate(
        id,
        { $set: content.data },
        { new: true, runValidators: true },
      );
    case "navigation":
      return NavigationModel.findByIdAndUpdate(
        id,
        { $set: content.data },
        { new: true, runValidators: true },
      );
  }
}

async function deleteDocument(resource: Resource, id: string) {
  switch (resource) {
    case "services":
      return ServiceModel.deleteOne({ _id: id });
    case "projects":
      return ProjectModel.deleteOne({ _id: id });
    case "products":
      return ProductModel.deleteOne({ _id: id });
    case "blog":
      return PostModel.deleteOne({ _id: id });
    case "categories":
      return CategoryModel.deleteOne({ _id: id });
    case "testimonials":
      return TestimonialModel.deleteOne({ _id: id });
    case "faqs":
      return FaqModel.deleteOne({ _id: id });
    case "navigation":
      return NavigationModel.deleteOne({ _id: id });
  }
}

async function writeAudit(
  userId: string,
  action: string,
  resource: Resource,
  documentId: string,
  before: unknown,
  after: unknown,
  request: Request,
) {
  const ip =
    request.headers.get("x-nf-client-connection-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "";
  const ipHash = ip ? createHash("sha256").update(ip).digest("hex") : "";
  await AuditLogModel.create({
    user: userId,
    action,
    collectionName: resource,
    documentId,
    before,
    after,
    ipHash,
  });
}

function isDuplicateKeyError(error: unknown): error is { code: number } {
  return typeof error === "object" && error !== null && "code" in error && error.code === 11000;
}

export async function GET(_request: Request, context: { params: Promise<{ resource: string }> }) {
  const { resource: name } = await context.params;
  if (!isResource(name))
    return NextResponse.json({ error: "Unknown content type." }, { status: 404 });
  await requireRole(resourceRoles[name]);
  await connectToDatabase();
  return NextResponse.json({ items: repairMojibakeDeep(await getDocuments(name)) });
}

export async function POST(request: Request, context: { params: Promise<{ resource: string }> }) {
  const originError = rejectCrossOriginMutation(request);
  if (originError) return originError;
  const { resource: name } = await context.params;
  if (!isResource(name))
    return NextResponse.json({ error: "Unknown content type." }, { status: 404 });
  const session = await requireRole(resourceRoles[name]);
  const parsed = parseCreate(name, await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.message }, { status: 400 });

  await connectToDatabase();
  try {
    const document = await createDocument(parsed.data, session.id);
    const item = document.toObject();
    await writeAudit(session.id, "create", name, String(document._id), null, item, request);
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return NextResponse.json({ error: "That slug or key is already in use." }, { status: 409 });
    }
    console.error(`Unable to create ${name} content.`, error);
    return NextResponse.json({ error: "Unable to save this content." }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ resource: string }> }) {
  const originError = rejectCrossOriginMutation(request);
  if (originError) return originError;
  const { resource: name } = await context.params;
  if (!isResource(name))
    return NextResponse.json({ error: "Unknown content type." }, { status: 404 });
  const session = await requireRole(resourceRoles[name]);
  const id = new URL(request.url).searchParams.get("id");
  if (!id || !/^[a-f\d]{24}$/i.test(id)) {
    return NextResponse.json({ error: "A valid document id is required." }, { status: 400 });
  }
  const parsed = parseUpdate(name, await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.message }, { status: 400 });

  await connectToDatabase();
  try {
    const before = await findDocument(name, id);
    if (!before) return NextResponse.json({ error: "Content not found." }, { status: 404 });
    const after = await updateDocument(name, id, parsed.data);
    if (!after) return NextResponse.json({ error: "Content not found." }, { status: 404 });
    const item = after.toObject();
    await writeAudit(session.id, "update", name, id, before, item, request);
    return NextResponse.json({ item });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return NextResponse.json({ error: "That slug or key is already in use." }, { status: 409 });
    }
    console.error(`Unable to update ${name} content.`, error);
    return NextResponse.json({ error: "Unable to update this content." }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ resource: string }> }) {
  const originError = rejectCrossOriginMutation(request);
  if (originError) return originError;
  const { resource: name } = await context.params;
  if (!isResource(name))
    return NextResponse.json({ error: "Unknown content type." }, { status: 404 });
  const session = await requireRole(resourceRoles[name]);
  const id = new URL(request.url).searchParams.get("id");
  if (!id || !/^[a-f\d]{24}$/i.test(id)) {
    return NextResponse.json({ error: "A valid document id is required." }, { status: 400 });
  }

  await connectToDatabase();
  const document = await findDocument(name, id);
  if (!document) return NextResponse.json({ error: "Content not found." }, { status: 404 });
  try {
    await deleteDocument(name, id);
    await writeAudit(session.id, "delete", name, id, document, null, request);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(`Unable to delete ${name} content.`, error);
    return NextResponse.json({ error: "Unable to delete this content." }, { status: 500 });
  }
}
