import bcrypt from "bcryptjs";
import type { Types } from "mongoose";
import { connectToDatabase, disconnectFromDatabase } from "./connection";
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
  UserModel,
  syncDatabaseIndexes,
} from "./models";
import {
  brandSeeds,
  categorySeeds,
  contentBlockSeeds,
  faqSeeds,
  navigationSeeds,
  postSeeds,
  productSeeds,
  projectSeeds,
  serviceSeeds,
  siteSettingSeed,
} from "./seed-data";

async function seedAdminUser(): Promise<boolean> {
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn("SEED_ADMIN_EMAIL or SEED_ADMIN_PASSWORD missing. Skipping admin user.");
    return false;
  }

  const existing = await UserModel.exists({ email });
  if (existing) {
    console.log(`Admin already exists: ${email}`);
    return false;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await UserModel.create({
    name: "KPESH Admin",
    email,
    passwordHash,
    role: "admin",
  });

  console.log(`Admin created: ${email}`);
  return true;
}

async function main(): Promise<void> {
  await connectToDatabase();
  await syncDatabaseIndexes();

  await seedAdminUser();

  if (!(await SiteSettingModel.exists({ key: "site" }))) {
    await SiteSettingModel.create(siteSettingSeed);
    console.log("Site settings created.");
  } else {
    console.log("Site settings already exist.");
  }

  let newCategories = 0;
  for (const item of categorySeeds) {
    if (!(await CategoryModel.exists({ kind: item.kind, slug: item.slug }))) {
      await CategoryModel.create(item);
      newCategories += 1;
    }
  }

  const categories = await CategoryModel.find().select("_id kind slug").lean();
  const categoryMap = new Map<string, Types.ObjectId>();
  for (const category of categories) {
    categoryMap.set(`${category.kind}:${category.slug}`, category._id);
  }

  let newBrands = 0;
  for (const item of brandSeeds) {
    if (!(await BrandModel.exists({ slug: item.slug }))) {
      await BrandModel.create(item);
      newBrands += 1;
    }
  }

  const brands = await BrandModel.find().select("_id slug").lean();
  const brandMap = new Map<string, Types.ObjectId>();
  for (const brand of brands) {
    brandMap.set(brand.slug, brand._id);
  }

  let newServices = 0;
  for (const item of serviceSeeds) {
    if (await ServiceModel.exists({ slug: item.slug })) {
      continue;
    }

    const { categoryKey, ...data } = item;
    await ServiceModel.create({
      ...data,
      category: categoryMap.get(categoryKey) ?? null,
    });
    newServices += 1;
  }

  let newProjects = 0;
  for (const item of projectSeeds) {
    if (await ProjectModel.exists({ slug: item.slug })) {
      continue;
    }

    const { categoryKey, ...data } = item;
    await ProjectModel.create({
      ...data,
      category: categoryMap.get(categoryKey) ?? null,
    });
    newProjects += 1;
  }

  let newProducts = 0;
  for (const item of productSeeds) {
    if (await ProductModel.exists({ slug: item.slug })) {
      continue;
    }

    const { categoryKey, brandSlug, ...data } = item;
    await ProductModel.create({
      ...data,
      category: categoryMap.get(categoryKey) ?? null,
      brand: brandSlug ? (brandMap.get(brandSlug) ?? null) : null,
    });
    newProducts += 1;
  }

  let newFaqs = 0;
  for (const item of faqSeeds) {
    if (await FaqModel.exists({ "question.bn": item.question.bn })) {
      continue;
    }
    await FaqModel.create(item);
    newFaqs += 1;
  }

  let newPosts = 0;
  for (const item of postSeeds) {
    if (await PostModel.exists({ slug: item.slug })) {
      continue;
    }

    const { categoryKey, ...data } = item;
    await PostModel.create({
      ...data,
      category: categoryMap.get(categoryKey) ?? null,
      publishedAt: item.status === "published" ? new Date() : null,
    });
    newPosts += 1;
  }

  let newNavigationItems = 0;
  for (const item of navigationSeeds) {
    if (await NavigationModel.exists({ href: item.href, location: item.location })) {
      continue;
    }
    await NavigationModel.create(item);
    newNavigationItems += 1;
  }

  let newContentBlocks = 0;
  for (const item of contentBlockSeeds) {
    if (await ContentBlockModel.exists({ key: item.key })) {
      continue;
    }
    await ContentBlockModel.create(item);
    newContentBlocks += 1;
  }

  console.log("Seed complete.");
  console.log(`New categories: ${newCategories}`);
  console.log(`New brands: ${newBrands}`);
  console.log(`New services: ${newServices}`);
  console.log(`New projects: ${newProjects}`);
  console.log(`New products: ${newProducts}`);
  console.log(`New FAQs: ${newFaqs}`);
  console.log(`New posts: ${newPosts}`);
  console.log(`New navigation items: ${newNavigationItems}`);
  console.log(`New content blocks: ${newContentBlocks}`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectFromDatabase();
  });
