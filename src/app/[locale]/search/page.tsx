import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { connectToDatabase } from "@/db/connection";
import { PostModel, ProductModel, ProjectModel, ServiceModel } from "@/db/models";
import { FadeIn, Stagger, StaggerItem } from "@/components/ui/motion";
import { SUPPORTED_LOCALES, type Locale } from "@/lib/site-content";
import { createPageMetadata } from "@/lib/seo";
import { repairMojibakeDeep } from "@/lib/text-encoding";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ q?: string }>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!SUPPORTED_LOCALES.includes(locale)) return {};
  const isBn = locale === "bn";
  return createPageMetadata({
    locale,
    path: "/search",
    title: isBn ? "সার্চ" : "Search",
    description: isBn
      ? "সেবা, প্রকল্প, পণ্য এবং নিবন্ধ খুঁজুন।"
      : "Search services, projects, products, and articles.",
  });
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: SearchParams;
}) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  if (!SUPPORTED_LOCALES.includes(locale)) notFound();

  const term = query.q?.trim().slice(0, 100) ?? "";
  const results: { title: string; description: string; href: string; type: string }[] = [];

  if (term.length >= 2) {
    await connectToDatabase();
    const match = new RegExp(escapeRegex(term), "i");
    const [rawServices, rawProjects, rawProducts, rawPosts] = await Promise.all([
      ServiceModel.find({
        isActive: true,
        $or: [
          { "title.bn": match },
          { "title.en": match },
          { "excerpt.bn": match },
          { "excerpt.en": match },
        ],
      })
        .select("title slug excerpt")
        .limit(20)
        .lean(),
      ProjectModel.find({
        isActive: true,
        $or: [
          { "title.bn": match },
          { "title.en": match },
          { "excerpt.bn": match },
          { "excerpt.en": match },
        ],
      })
        .select("title slug excerpt")
        .limit(20)
        .lean(),
      ProductModel.find({
        isActive: true,
        $or: [
          { "title.bn": match },
          { "title.en": match },
          { "excerpt.bn": match },
          { "excerpt.en": match },
        ],
      })
        .select("title slug excerpt")
        .limit(20)
        .lean(),
      PostModel.find({
        status: "published",
        $or: [
          { "title.bn": match },
          { "title.en": match },
          { "excerpt.bn": match },
          { "excerpt.en": match },
        ],
      })
        .select("title slug excerpt")
        .limit(20)
        .lean(),
    ]);
    const services = repairMojibakeDeep(rawServices);
    const projects = repairMojibakeDeep(rawProjects);
    const products = repairMojibakeDeep(rawProducts);
    const posts = repairMojibakeDeep(rawPosts);

    for (const [type, records] of [
      ["services", services],
      ["projects", projects],
      ["products", products],
      ["blog", posts],
    ] as const) {
      for (const record of records) {
        results.push({
          type,
          title: record.title[locale] || record.title.en || record.title.bn,
          description: record.excerpt[locale] || record.excerpt.en || record.excerpt.bn,
          href: `/${locale}/${type}/${encodeURIComponent(record.slug)}`,
        });
      }
    }
  }

  const isBn = locale === "bn";
  return (
    <main lang={locale} className="min-h-screen bg-white text-slate-800">
      <FadeIn>
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900">{isBn ? "সার্চ করুন" : "Search"}</h1>
          <form className="mt-6 flex gap-3">
            <input
              name="q"
              defaultValue={term}
              minLength={2}
              maxLength={100}
              placeholder={
                isBn
                  ? "সেবা, পণ্য, প্রকল্প বা নিবন্ধ..."
                  : "Services, products, projects, or articles..."
              }
              className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3"
            />
            <button className="rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white">
              {isBn ? "খুঁজুন" : "Search"}
            </button>
          </form>
          {term && term.length < 2 ? (
            <p className="mt-4 text-sm text-slate-500">
              {isBn ? "কমপক্ষে ২টি অক্ষর লিখুন।" : "Enter at least 2 characters."}
            </p>
          ) : null}
          <Stagger className="mt-8 space-y-3">
            {results.map((result) => (
              <StaggerItem key={result.href}>
                <Link
                  href={result.href}
                  className="block rounded-2xl border border-slate-200 p-5 transition hover:border-brand"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-dark">
                    {result.type}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-900">{result.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{result.description}</p>
                </Link>
              </StaggerItem>
            ))}
            {term.length >= 2 && results.length === 0 ? (
              <p className="text-slate-500">
                {isBn ? "কোনো ফলাফল পাওয়া যায়নি।" : "No results found."}
              </p>
            ) : null}
          </Stagger>
        </section>
      </FadeIn>
    </main>
  );
}
