import type { MetadataRoute } from "next";
import { connectToDatabase } from "@/db/connection";
import { PostModel, ProductModel, ProjectModel, ServiceModel } from "@/db/models";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
  const fixedPaths = [
    "",
    "/services",
    "/projects",
    "/products",
    "/blog",
    "/search",
    "/privacy",
    "/terms",
  ];

  await connectToDatabase();
  const [services, projects, products, posts] = await Promise.all([
    ServiceModel.find({ isActive: true }).select("slug updatedAt").lean(),
    ProjectModel.find({ isActive: true }).select("slug updatedAt").lean(),
    ProductModel.find({ isActive: true }).select("slug updatedAt").lean(),
    PostModel.find({ status: "published" }).select("slug updatedAt").lean(),
  ]);
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of ["bn", "en"] as const) {
    for (const path of fixedPaths) {
      entries.push({
        url: `${baseUrl}/${locale}${path}`,
        alternates: {
          languages: { "bn-BD": `${baseUrl}/bn${path}`, "en-US": `${baseUrl}/en${path}` },
        },
      });
    }
    for (const [prefix, records] of [
      ["services", services],
      ["projects", projects],
      ["products", products],
      ["blog", posts],
    ] as const) {
      for (const record of records) {
        entries.push({
          url: `${baseUrl}/${locale}/${prefix}/${encodeURIComponent(record.slug)}`,
          lastModified: record.updatedAt,
          alternates: {
            languages: {
              "bn-BD": `${baseUrl}/bn/${prefix}/${encodeURIComponent(record.slug)}`,
              "en-US": `${baseUrl}/en/${prefix}/${encodeURIComponent(record.slug)}`,
            },
          },
        });
      }
    }
  }
  return entries;
}
