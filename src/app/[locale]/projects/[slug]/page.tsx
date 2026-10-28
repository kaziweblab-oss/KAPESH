import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { connectToDatabase } from "@/db/connection";
import { ProjectModel } from "@/db/models";
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
  const project = repairMojibakeDeep(await ProjectModel.findOne({ slug, isActive: true }).lean());
  if (!project) return {};
  return createPageMetadata({
    locale,
    path: `/projects/${slug}`,
    title: project.seo.title[locale] || project.title[locale],
    description:
      project.seo.description[locale] || project.excerpt[locale] || project.content[locale],
    image: project.seo.ogImageUrl || project.cover.url || undefined,
  });
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.flatMap((locale) =>
    ["home-solar-conversion", "commercial-ups", "battery-backup-system"].map((slug) => ({
      locale,
      slug,
    })),
  );
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;

  if (!SUPPORTED_LOCALES.includes(locale)) notFound();
  await connectToDatabase();
  const project = repairMojibakeDeep(await ProjectModel.findOne({ slug, isActive: true }).lean());
  if (!project) notFound();

  return (
    <main className="min-h-screen bg-white text-slate-800">
      <StructuredData
        value={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: project.title[locale],
          description: project.excerpt[locale] || project.content[locale],
          image: project.cover.url || undefined,
          url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/${locale}/projects/${project.slug}`,
        }}
      />
      <FadeIn>
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <Link
            href={`/${locale}/projects`}
            className="inline-flex text-sm font-semibold text-brand-dark"
          >
            ← {locale === "bn" ? "প্রকল্পসমূহ" : "Back to projects"}
          </Link>
          <div className="mt-8 rounded-[2rem] border border-slate-200 bg-slate-50 p-8">
            {project.cover.url ? (
              <Image
                src={project.cover.url}
                alt={project.cover.alt[locale] || project.title[locale]}
                width={project.cover.width || 1200}
                height={project.cover.height || 800}
                sizes="(max-width: 768px) 100vw, 768px"
                className="max-h-[28rem] w-full rounded-[1.5rem] object-cover"
              />
            ) : (
              <div className="h-52 rounded-[1.5rem] bg-[radial-gradient(circle_at_top,_rgba(155,214,74,0.5),_rgba(9,42,50,0.92)_60%)]" />
            )}
            <h1 className="mt-6 text-3xl font-bold text-slate-900 sm:text-5xl">
              {project.title[locale]}
            </h1>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.22em] text-brand-dark">
              {project.capacity || (locale === "bn" ? "সম্পন্ন প্রকল্প" : "Completed project")}
            </p>
            <p className="mt-5 text-lg text-slate-600">
              {project.content[locale] || project.excerpt[locale]}
            </p>
            {project.gallery.length ? (
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {project.gallery.map((image, index) => (
                  <Image
                    key={image.publicId || image.url || index}
                    src={image.url}
                    alt={image.alt[locale] || `${project.title[locale]} ${index + 1}`}
                    width={image.width || 900}
                    height={image.height || 650}
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="h-64 w-full rounded-2xl object-cover"
                  />
                ))}
              </div>
            ) : null}
          </div>
        </section>
      </FadeIn>
    </main>
  );
}
