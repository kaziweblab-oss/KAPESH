import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { connectToDatabase } from "@/db/connection";
import { ServiceModel } from "@/db/models";
import { FadeIn, Stagger, StaggerItem } from "@/components/ui/motion";
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
  const service = repairMojibakeDeep(await ServiceModel.findOne({ slug, isActive: true }).lean());
  if (!service) return {};
  return createPageMetadata({
    locale,
    path: `/services/${slug}`,
    title: service.seo.title[locale] || service.title[locale],
    description:
      service.seo.description[locale] || service.excerpt[locale] || service.content[locale],
    image: service.seo.ogImageUrl || service.cover.url || undefined,
  });
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.flatMap((locale) =>
    ["solar-system", "ips-inverter", "battery-solution", "maintenance-support"].map((slug) => ({
      locale,
      slug,
    })),
  );
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;

  if (!SUPPORTED_LOCALES.includes(locale)) notFound();
  await connectToDatabase();
  const service = repairMojibakeDeep(await ServiceModel.findOne({ slug, isActive: true }).lean());
  if (!service) notFound();

  return (
    <main className="min-h-screen bg-white text-slate-800">
      <StructuredData
        value={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.title[locale],
          description: service.excerpt[locale] || service.content[locale],
          image: service.cover.url || undefined,
          url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/${locale}/services/${service.slug}`,
        }}
      />
      <FadeIn>
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <Link
            href={`/${locale}/services`}
            className="inline-flex text-sm font-semibold text-brand-dark"
          >
            ← {locale === "bn" ? "সেবাসমূহ" : "Back to services"}
          </Link>
          <div className="mt-8 rounded-[2rem] border border-slate-200 bg-slate-50 p-8">
            {service.cover.url ? (
              <Image
                src={service.cover.url}
                alt={service.cover.alt[locale] || service.title[locale]}
                width={service.cover.width || 1200}
                height={service.cover.height || 800}
                sizes="(max-width: 768px) 100vw, 768px"
                className="mb-6 max-h-[28rem] w-full rounded-2xl object-cover"
              />
            ) : null}
            <span className="inline-flex rounded-full bg-brand/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-dark">
              {locale === "bn" ? "সেবা" : "Service"}
            </span>
            <h1 className="mt-5 text-3xl font-bold text-slate-900 sm:text-5xl">
              {service.title[locale]}
            </h1>
            <p className="mt-5 text-lg text-slate-600">
              {service.content[locale] || service.excerpt[locale]}
            </p>
          </div>

          <Stagger className="mt-10 grid gap-6 md:grid-cols-3">
            {service.features.map((feature, index) => (
              <StaggerItem key={`${service._id.toString()}-${index}`}>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-brand text-lg font-bold text-navy">
                    ✓
                  </div>
                  <p className="font-medium text-slate-700">{feature.title[locale]}</p>
                  <p className="mt-2 text-sm text-slate-600">{feature.description[locale]}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      </FadeIn>
    </main>
  );
}
