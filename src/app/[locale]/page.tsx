import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { FadeIn, Stagger, StaggerItem } from "@/components/ui/motion";
import { StructuredData } from "@/components/public/structured-data";
import { DecorativeVideoBackground } from "@/components/public/decorative-video-background";
import { LiveEnergyBackground } from "@/components/public/live-energy-background";
import { connectToDatabase } from "@/db/connection";
import { ProductModel, ProjectModel, ServiceModel, SiteSettingModel } from "@/db/models";
import { createPageMetadata } from "@/lib/seo";
import { SUPPORTED_LOCALES, type Locale } from "@/lib/site-content";
import { repairMojibakeDeep } from "@/lib/text-encoding";

export const dynamic = "force-dynamic";

const homeCopy = {
  bn: {
    eyebrow: "বিশ্বস্ত পাওয়ার ও এনার্জি পার্টনার",
    title: "আপনার ব্যবসা ও বাসার জন্য",
    accent: "নির্ভরযোগ্য শক্তি",
    description:
      "সোলার, IPS, ইনভার্টার ও ব্যাটারি সমাধান—পরামর্শ থেকে ইনস্টলেশন ও পরবর্তী সেবা, সবকিছু এক জায়গায়।",
    services: "সেবাসমূহ দেখুন",
    quote: "কোটেশন নিন",
    servicesTitle: "আমাদের সেবাসমূহ",
    servicesText: "আপনার প্রয়োজন অনুযায়ী পরিকল্পিত পাওয়ার সলিউশন।",
    productsTitle: "জনপ্রিয় পণ্য",
    projectsTitle: "সাম্প্রতিক প্রকল্প",
    viewAll: "সব দেখুন",
    aboutTitle: "শক্তির নির্ভরযোগ্য সমাধান, আপনার পাশে",
    aboutText:
      "KPESH বাসা ও ব্যবসার জন্য সোলার, IPS, ইনভার্টার এবং ব্যাটারির সমাধান পরিকল্পনা ও সরবরাহ করে। সঠিক পরামর্শ, মানসম্মত ইনস্টলেশন এবং নির্ভরযোগ্য সহায়তাই আমাদের অঙ্গীকার।",
    aboutLink: "আমাদের সম্পর্কে",
    contactTitle: "আপনার প্রজেক্ট নিয়ে কথা বলুন",
    contactText: "আপনার প্রয়োজন জানান—আমাদের টিম উপযুক্ত সমাধান নিয়ে যোগাযোগ করবে।",
    contactLink: "যোগাযোগ করুন",
    empty: "তথ্য শিগগিরই যোগ করা হবে।",
    productFallback: "পণ্য",
    projectFallback: "প্রকল্প",
    learnMore: "বিস্তারিত",
    priceCall: "দাম জানতে যোগাযোগ করুন",
  },
  en: {
    eyebrow: "Your trusted power and energy partner",
    title: "Reliable energy for",
    accent: "home and business",
    description:
      "Solar, IPS, inverter, and battery solutions—from consultation to installation and after-sales support, all in one place.",
    services: "Explore services",
    quote: "Get a quote",
    servicesTitle: "What we do",
    servicesText: "Power solutions planned around your needs.",
    productsTitle: "Featured products",
    projectsTitle: "Recent projects",
    viewAll: "View all",
    aboutTitle: "Reliable power solutions, built around you",
    aboutText:
      "KPESH plans and supplies solar, IPS, inverter, and battery solutions for homes and businesses. We are committed to practical advice, quality installation, and dependable support.",
    aboutLink: "About KPESH",
    contactTitle: "Let's discuss your project",
    contactText: "Tell us what you need and our team will help you find the right solution.",
    contactLink: "Contact us",
    empty: "New information will be added soon.",
    productFallback: "Product",
    projectFallback: "Project",
    learnMore: "Learn more",
    priceCall: "Contact for price",
  },
} as const;

function localized(locale: Locale, value?: { bn?: string; en?: string } | null) {
  return value?.[locale] || value?.en || value?.bn || "";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!SUPPORTED_LOCALES.includes(locale)) return {};

  await connectToDatabase();
  const settings = repairMojibakeDeep(
    await SiteSettingModel.findOne({ key: "site" }).select("siteName seo").lean(),
  );
  const copy = homeCopy[locale];
  return createPageMetadata({
    locale,
    path: "",
    title: settings?.seo?.title?.[locale] || settings?.siteName?.[locale] || "KPESH",
    description: settings?.seo?.description?.[locale] || copy.description,
    image: settings?.seo?.ogImageUrl || undefined,
  });
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function LocalePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  if (!SUPPORTED_LOCALES.includes(locale)) notFound();

  const copy = homeCopy[locale];
  await connectToDatabase();
  const [rawServices, rawProducts, rawProjects, rawSettings] = await Promise.all([
    ServiceModel.find({ isActive: true }).sort({ featured: -1, sortOrder: 1 }).limit(3).lean(),
    ProductModel.find({ isActive: true }).sort({ featured: -1, sortOrder: 1 }).limit(3).lean(),
    ProjectModel.find({ isActive: true }).sort({ featured: -1, sortOrder: 1 }).limit(3).lean(),
    SiteSettingModel.findOne({ key: "site" }).lean(),
  ]);
  const services = repairMojibakeDeep(rawServices);
  const products = repairMojibakeDeep(rawProducts);
  const projects = repairMojibakeDeep(rawProjects);
  const settings = repairMojibakeDeep(rawSettings);

  return (
    <main lang={locale} className="min-h-screen bg-white text-slate-800">
      <StructuredData
        value={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: localized(locale, settings?.siteName) || settings?.shortName || "KPESH",
          url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/${locale}`,
          image: settings?.logo?.url || settings?.seo?.ogImageUrl || undefined,
          telephone: settings?.contact?.phone || undefined,
          email: settings?.contact?.email || undefined,
          address: localized(locale, settings?.contact?.address) || undefined,
          sameAs: Object.values(settings?.social ?? {}).filter(Boolean),
        }}
      />

      <section className="public-hero-ambient relative isolate overflow-hidden bg-navy text-white">
        <div className="public-hero-orb public-hero-orb-one" aria-hidden="true" />
        <div className="public-hero-orb public-hero-orb-two" aria-hidden="true" />
        <DecorativeVideoBackground videoUrl={settings?.backgroundVideo?.url} />
        <LiveEnergyBackground />
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(115deg,transparent_25%,rgba(155,214,74,0.07)_50%,transparent_75%)]"
          aria-hidden="true"
        />
        <FadeIn className="relative z-10 mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-[1.2fr_0.8fr] md:items-center lg:px-8 lg:py-28">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
              <span className="h-2 w-2 rounded-full bg-brand" />
              {copy.eyebrow}
            </p>
            <h1 className="mt-7 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {copy.title} <span className="text-brand">{copy.accent}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
              {copy.description}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href={`/${locale}/services`}
                className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-navy transition hover:bg-brand/90"
              >
                {copy.services}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {copy.quote}
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[
              locale === "bn" ? "সোলার সলিউশন" : "Solar solutions",
              locale === "bn" ? "IPS ও ইনভার্টার" : "IPS & inverters",
              locale === "bn" ? "ব্যাটারি সিস্টেম" : "Battery systems",
              locale === "bn" ? "ইনস্টলেশন ও সাপোর্ট" : "Installation & support",
            ].map((label) => (
              <div
                key={label}
                className="min-h-32 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm sm:min-h-36 sm:p-6"
              >
                <p className="text-sm font-semibold leading-6 text-white sm:text-base">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-dark">
              KPESH
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">{copy.servicesTitle}</h2>
            <p className="mt-2 text-slate-600">{copy.servicesText}</p>
          </div>
          <Link
            href={`/${locale}/services`}
            className="group inline-flex items-center rounded-full border border-transparent px-3 py-1.5 text-sm font-semibold text-brand-dark transition-all duration-200 hover:border-brand/70 hover:bg-brand/10 hover:text-navy hover:shadow-[0_0_0_3px_rgba(155,214,74,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {copy.viewAll}
            <span aria-hidden="true" className="ml-1 transition-transform duration-200 group-hover:translate-x-0.5">
              ↗
            </span>
          </Link>
        </div>
        <Stagger className="mt-8 grid gap-5 md:grid-cols-3">
          {services.map((service, index) => (
            <StaggerItem key={service._id.toString()} index={index}>
              <Link
                href={`/${locale}/services/${service.slug}`}
                className="group block h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-brand/60 hover:shadow-lg hover:shadow-navy/5"
              >
                <h3 className="text-xl font-semibold text-slate-900 group-hover:text-brand-dark">
                  {localized(locale, service.title)}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
                  {localized(locale, service.excerpt)}
                </p>
                <span className="mt-5 inline-flex text-sm font-semibold text-brand-dark">
                  {copy.learnMore} ↗
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
        {services.length === 0 ? (
          <p className="mt-8 text-center text-slate-500">{copy.empty}</p>
        ) : null}
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl font-bold text-slate-900">{copy.productsTitle}</h2>
            <Link
              href={`/${locale}/products`}
              className="group inline-flex items-center rounded-full border border-transparent px-3 py-1.5 text-sm font-semibold text-brand-dark transition-all duration-200 hover:border-brand/70 hover:bg-brand/10 hover:text-navy hover:shadow-[0_0_0_3px_rgba(155,214,74,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              {copy.viewAll}
              <span aria-hidden="true" className="ml-1 transition-transform duration-200 group-hover:translate-x-0.5">
                ↗
              </span>
            </Link>
          </div>
          <Stagger className="mt-8 grid gap-5 md:grid-cols-3">
            {products.map((product, index) => (
              <StaggerItem key={product._id.toString()} index={index}>
                <Link
                  href={`/${locale}/products/${product.slug}`}
                  className="block h-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-brand/50 hover:shadow-lg hover:shadow-navy/5"
                >
                  {product.cover.url ? (
                    <Image
                      src={product.cover.url}
                      alt={product.cover.alt?.[locale] || localized(locale, product.title)}
                      width={product.cover.width || 800}
                      height={product.cover.height || 600}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="h-52 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-52 items-center justify-center bg-navy text-4xl text-brand">
                      ⚡
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {localized(locale, product.title) || copy.productFallback}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                      {localized(locale, product.excerpt)}
                    </p>
                    <p className="mt-4 text-sm font-semibold text-brand-dark">
                      {product.price.showPrice
                        ? `${product.price.currency} ${product.price.amount.toLocaleString()}`
                        : copy.priceCall}
                    </p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
          {products.length === 0 ? (
            <p className="mt-8 text-center text-slate-500">{copy.empty}</p>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl font-bold text-slate-900">{copy.projectsTitle}</h2>
          <Link
            href={`/${locale}/projects`}
            className="group inline-flex items-center rounded-full border border-transparent px-3 py-1.5 text-sm font-semibold text-brand-dark transition-all duration-200 hover:border-brand/70 hover:bg-brand/10 hover:text-navy hover:shadow-[0_0_0_3px_rgba(155,214,74,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {copy.viewAll}
            <span aria-hidden="true" className="ml-1 transition-transform duration-200 group-hover:translate-x-0.5">
              ↗
            </span>
          </Link>
        </div>
        <Stagger className="mt-8 grid gap-5 md:grid-cols-3">
          {projects.map((project, index) => (
            <StaggerItem key={project._id.toString()} index={index}>
              <Link
                href={`/${locale}/projects/${project.slug}`}
                className="group block h-full overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all duration-300 hover:border-brand/50 hover:shadow-lg hover:shadow-navy/5"
              >
                {project.cover.url ? (
                  <Image
                    src={project.cover.url}
                    alt={project.cover.alt?.[locale] || localized(locale, project.title)}
                    width={project.cover.width || 900}
                    height={project.cover.height || 650}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="h-52 w-full object-cover"
                  />
                ) : (
                  <div className="h-52 bg-[radial-gradient(circle_at_top,_rgba(155,214,74,0.5),_rgba(9,42,50,0.92)_60%)]" />
                )}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-brand-dark">
                    {localized(locale, project.title) || copy.projectFallback}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                    {localized(locale, project.excerpt)}
                  </p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
        {projects.length === 0 ? (
          <p className="mt-8 text-center text-slate-500">{copy.empty}</p>
        ) : null}
      </section>

      <section className="bg-navy py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-[1fr_auto] md:items-center lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
              {copy.aboutLink}
            </p>
            <h2 className="mt-3 text-3xl font-bold">{copy.aboutTitle}</h2>
            <p className="mt-4 max-w-3xl leading-7 text-white/75">{copy.aboutText}</p>
          </div>
          <Link
            href={`/${locale}/about`}
            className="inline-flex justify-center rounded-full border border-white/25 px-6 py-3 text-sm font-semibold transition hover:bg-white/10"
          >
            {copy.aboutLink} ↗
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 rounded-[2rem] bg-brand/15 p-7 sm:p-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-navy sm:text-3xl">{copy.contactTitle}</h2>
            <p className="mt-3 max-w-2xl text-slate-700">{copy.contactText}</p>
          </div>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex shrink-0 justify-center rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-navy-2"
          >
            {copy.contactLink} ↗
          </Link>
        </div>
      </section>

    </main>
  );
}
