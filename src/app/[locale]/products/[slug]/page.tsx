import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { connectToDatabase } from "@/db/connection";
import { ProductModel } from "@/db/models";
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
  const product = repairMojibakeDeep(await ProductModel.findOne({ slug, isActive: true }).lean());
  if (!product) return {};
  return createPageMetadata({
    locale,
    path: `/products/${slug}`,
    title: product.seo.title[locale] || product.title[locale],
    description:
      product.seo.description[locale] || product.excerpt[locale] || product.description[locale],
    image: product.seo.ogImageUrl || product.cover.url || undefined,
  });
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.flatMap((locale) =>
    ["solar-panel", "inverter", "ups-ips", "battery"].map((slug) => ({ locale, slug })),
  );
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;

  if (!SUPPORTED_LOCALES.includes(locale)) notFound();
  await connectToDatabase();
  const product = repairMojibakeDeep(await ProductModel.findOne({ slug, isActive: true }).lean());
  if (!product) notFound();

  return (
    <main className="min-h-screen bg-white text-slate-800">
      <StructuredData
        value={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.title[locale],
          description: product.excerpt[locale] || product.description[locale],
          image: [product.cover.url, ...product.images.map((image) => image.url)].filter(Boolean),
          offers: product.price.showPrice
            ? {
                "@type": "Offer",
                priceCurrency: product.price.currency,
                price: product.price.amount,
                availability:
                  product.stockStatus === "in_stock"
                    ? "https://schema.org/InStock"
                    : product.stockStatus === "pre_order"
                      ? "https://schema.org/PreOrder"
                      : "https://schema.org/OutOfStock",
              }
            : undefined,
        }}
      />
      <FadeIn>
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <Link
            href={`/${locale}/products`}
            className="inline-flex text-sm font-semibold text-brand-dark"
          >
            ← {locale === "bn" ? "পণ্যসমূহ" : "Back to products"}
          </Link>
          <div className="mt-8 rounded-[2rem] border border-slate-200 bg-slate-50 p-8">
            {product.cover.url ? (
              <Image
                src={product.cover.url}
                alt={product.cover.alt[locale] || product.title[locale]}
                width={product.cover.width || 1200}
                height={product.cover.height || 800}
                sizes="(max-width: 768px) 100vw, 768px"
                className="max-h-[28rem] w-full rounded-2xl object-cover"
              />
            ) : null}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-xl text-brand">
              ⚡
            </div>
            <h1 className="mt-6 text-3xl font-bold text-slate-900 sm:text-5xl">
              {product.title[locale]}
            </h1>
            <p className="mt-5 text-lg text-slate-600">
              {product.description[locale] || product.excerpt[locale]}
            </p>
            <div className="mt-6 inline-flex rounded-full bg-brand/15 px-4 py-2 text-sm font-semibold text-brand-dark">
              {product.price.showPrice
                ? `${product.price.currency} ${product.price.amount.toLocaleString()}`
                : locale === "bn"
                  ? "দাম জানতে যোগাযোগ করুন"
                  : "Contact for price"}
            </div>
            {product.specs.length ? (
              <dl className="mt-8 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white px-5">
                {product.specs.map((spec, index) => (
                  <div key={`${spec.label.en}-${index}`} className="grid gap-1 py-3 sm:grid-cols-2">
                    <dt className="font-medium text-slate-700">
                      {spec.label[locale] || spec.label.en || spec.label.bn}
                    </dt>
                    <dd className="text-slate-600">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            {product.images.map((image, index) => (
              <Image
                key={image.publicId || image.url || index}
                src={image.url}
                alt={image.alt[locale] || `${product.title[locale]} ${index + 1}`}
                width={image.width || 900}
                height={image.height || 650}
                sizes="(max-width: 768px) 100vw, 768px"
                className="mt-4 max-h-96 w-full rounded-2xl object-cover"
              />
            ))}
          </div>
        </section>
      </FadeIn>
    </main>
  );
}
