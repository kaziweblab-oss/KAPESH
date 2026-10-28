import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import sanitizeHtml from "sanitize-html";
import { connectToDatabase } from "@/db/connection";
import { PostModel } from "@/db/models";
import { FadeIn } from "@/components/ui/motion";
import { SUPPORTED_LOCALES, type Locale } from "@/lib/site-content";
import { createPageMetadata } from "@/lib/seo";
import { StructuredData } from "@/components/public/structured-data";
import { repairMojibakeDeep } from "@/lib/text-encoding";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!SUPPORTED_LOCALES.includes(locale)) return {};
  await connectToDatabase();
  const post = repairMojibakeDeep(await PostModel.findOne({ slug, status: "published" }).lean());
  if (!post) return {};
  return createPageMetadata({
    locale,
    path: `/blog/${slug}`,
    title: post.seo.title[locale] || post.title[locale],
    description: post.seo.description[locale] || post.excerpt[locale] || post.content[locale],
    image: post.seo.ogImageUrl || post.cover.url || undefined,
  });
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.flatMap((locale) =>
    ["solar-for-home", "battery-maintenance-guide"].map((slug) => ({ locale, slug })),
  );
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;

  if (!SUPPORTED_LOCALES.includes(locale)) notFound();
  await connectToDatabase();
  const post = repairMojibakeDeep(await PostModel.findOne({ slug, status: "published" }).lean());
  if (!post) notFound();

  return (
    <main className="min-h-screen bg-white text-slate-800">
      <StructuredData
        value={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title[locale],
          description: post.excerpt[locale],
          image: post.cover.url || undefined,
          datePublished: post.publishedAt?.toISOString(),
          dateModified: post.updatedAt.toISOString(),
          mainEntityOfPage: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/${locale}/blog/${post.slug}`,
        }}
      />
      <FadeIn>
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex text-sm font-semibold text-brand-dark"
          >
            ← {locale === "bn" ? "ব্লগ" : "Back to blog"}
          </Link>

          <article className="mt-8 rounded-[2rem] border border-slate-200 bg-slate-50 p-8">
            {post.cover.url ? (
              <Image
                src={post.cover.url}
                alt={post.cover.alt[locale] || post.title[locale]}
                width={post.cover.width || 1200}
                height={post.cover.height || 800}
                sizes="(max-width: 768px) 100vw, 768px"
                className="mb-6 max-h-[28rem] w-full rounded-2xl object-cover"
              />
            ) : null}
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-dark">
              {post.publishedAt?.toLocaleDateString(locale)}
            </p>
            <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-5xl">
              {post.title[locale]}
            </h1>
            <p className="mt-5 text-lg text-slate-600">{post.excerpt[locale]}</p>

            <div
              className="prose prose-slate mt-8 max-w-none text-slate-700"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content[locale]) }}
            />
          </article>
        </section>
      </FadeIn>
    </main>
  );
}
