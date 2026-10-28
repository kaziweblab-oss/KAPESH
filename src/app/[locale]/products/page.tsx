import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { connectToDatabase } from "@/db/connection";
import { ProductModel } from "@/db/models";
import { FadeIn, Stagger, StaggerItem } from "@/components/ui/motion";
import { SUPPORTED_LOCALES, type Locale } from "@/lib/site-content";
import { createPageMetadata } from "@/lib/seo";
import { repairMojibakeDeep } from "@/lib/text-encoding";

export const dynamic = "force-dynamic";

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
    path: "/products",
    title: isBn ? "পণ্যসমূহ" : "Products",
    description: isBn
      ? "সোলার, ইনভার্টার, IPS ও ব্যাটারির পণ্যসমূহ।"
      : "Solar, inverter, IPS, and battery products.",
  });
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  if (!SUPPORTED_LOCALES.includes(locale)) notFound();

  await connectToDatabase();
  const products = repairMojibakeDeep(
    await ProductModel.find({ isActive: true }).sort({ featured: -1, sortOrder: 1 }).lean(),
  );

  return (
    <main className="min-h-screen bg-white text-slate-800">
      <FadeIn>
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.25em] text-brand-dark">
            {locale === "bn" ? "আমাদের পণ্য" : "Our products"}
          </p>
          <h1 className="mt-4 text-center text-3xl font-bold text-slate-900 sm:text-5xl">
            {locale === "bn" ? "নির্ভরযোগ্য পাওয়ার সরঞ্জাম" : "Reliable power equipment"}
          </h1>

          <Stagger className="mt-12 grid gap-6 min-[45rem]:grid-cols-2 xl:grid-cols-4">
            {products.map((product, index) => (
              <StaggerItem key={product._id.toString()} className="h-full" index={index}>
                <Link
                  href={`/${locale}/products/${product.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:border-brand/60 hover:shadow-xl hover:shadow-navy/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                >
                  <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-gradient-to-br from-navy via-navy-2 to-[#0b302f]">
                    {product.cover.url ? (
                      <Image
                        src={product.cover.url}
                        alt={product.cover.alt[locale] || product.title[locale]}
                        width={product.cover.width || 700}
                        height={product.cover.height || 500}
                        sizes="(max-width: 768px) 100vw, (max-width: 1279px) 50vw, 25vw"
                        className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      />
                    ) : (
                      <div
                        aria-hidden="true"
                        className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_70%_25%,rgba(57,198,190,0.28),transparent_35%),radial-gradient(circle_at_20%_90%,rgba(155,214,74,0.2),transparent_36%)]"
                      >
                        <span className="text-5xl text-brand">⚡</span>
                      </div>
                    )}
                    <span className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-navy/75 text-lg text-brand shadow-lg backdrop-blur-sm">
                      ⚡
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <h2 className="min-h-[3.5rem] text-xl font-semibold leading-7 text-slate-900 transition-colors group-hover:text-brand-dark">
                      {product.title[locale]}
                    </h2>
                    <p className="mt-3 line-clamp-3 min-h-[5.25rem] text-sm leading-7 text-slate-600">
                      {product.excerpt[locale]}
                    </p>
                    <p className="mt-auto pt-5 text-sm font-semibold text-brand-dark">
                      {product.price.showPrice
                        ? `${product.price.currency} ${product.price.amount.toLocaleString()}`
                        : locale === "bn"
                          ? "দাম জানতে যোগাযোগ করুন"
                          : "Contact for price"}
                    </p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
          {products.length === 0 ? (
            <p className="mt-10 text-center text-slate-500">
              {locale === "bn"
                ? "এখনো কোনো পণ্য যোগ করা হয়নি।"
                : "No products have been added yet."}
            </p>
          ) : null}
        </section>
      </FadeIn>
    </main>
  );
}
