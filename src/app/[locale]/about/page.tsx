import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LiveEnergyBackground } from "@/components/public/live-energy-background";
import { FadeIn, Stagger, StaggerItem } from "@/components/ui/motion";
import { connectToDatabase } from "@/db/connection";
import { FaqModel, SiteSettingModel, TestimonialModel } from "@/db/models";
import { createPageMetadata } from "@/lib/seo";
import { SUPPORTED_LOCALES, type Locale } from "@/lib/site-content";
import { repairMojibakeDeep } from "@/lib/text-encoding";

export const dynamic = "force-dynamic";

const aboutCopy = {
  bn: {
    title: "শক্তির নির্ভরযোগ্য সমাধান, আপনার পাশে",
    intro:
      "Kashmiri Power Engineering Solution Hub (KPESH) বাসা, অফিস ও ব্যবসার জন্য আধুনিক এনার্জি সলিউশন পরিকল্পনা ও সরবরাহ করে।",
    detail:
      "গ্রাহকের ব্যবহার, বিদ্যুতের চাহিদা ও বাজেট বুঝে সঠিক সোলার, IPS, ইনভার্টার ও ব্যাটারি সমাধান বেছে নিতে আমরা সহায়তা করি। আমাদের লক্ষ্য নিরাপদ ইনস্টলেশন, মানসম্মত কাজ এবং নির্ভরযোগ্য পরবর্তী সেবা নিশ্চিত করা।",
    values: [
      ["প্রয়োজনভিত্তিক পরামর্শ", "আপনার লোড ও বাজেট অনুযায়ী ব্যবহারিক সমাধান।"],
      ["নিরাপদ ইনস্টলেশন", "সঠিক পরিকল্পনা ও মানসম্মত কাজের প্রতি অঙ্গীকার।"],
      ["দীর্ঘমেয়াদি সহায়তা", "পণ্য নির্বাচন থেকে ইনস্টলেশনের পরের সেবা পর্যন্ত।"],
    ],
    reviews: "গ্রাহকদের অভিজ্ঞতা",
    faq: "সাধারণ প্রশ্ন",
    contact: "আপনার প্রজেক্ট নিয়ে কথা বলুন",
    contactLink: "যোগাযোগ করুন",
  },
  en: {
    title: "Reliable power solutions, built around you",
    intro:
      "Kashmiri Power Engineering Solution Hub (KPESH) plans and supplies modern energy solutions for homes, offices, and businesses.",
    detail:
      "We help customers choose the right solar, IPS, inverter, and battery solutions based on their usage, power requirements, and budget. Our goal is to deliver safe installation, quality workmanship, and dependable after-sales support.",
    values: [
      ["Practical guidance", "Solutions planned around your power needs and budget."],
      ["Safe installation", "Thoughtful planning and quality workmanship."],
      ["Ongoing support", "Help from product selection through after-sales service."],
    ],
    reviews: "Customer experiences",
    faq: "Frequently asked questions",
    contact: "Let's discuss your project",
    contactLink: "Contact us",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!SUPPORTED_LOCALES.includes(locale)) return {};
  const copy = aboutCopy[locale];
  return createPageMetadata({
    locale,
    path: "/about",
    title: locale === "bn" ? "আমাদের সম্পর্কে | KPESH" : "About KPESH",
    description: copy.intro,
  });
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  if (!SUPPORTED_LOCALES.includes(locale)) notFound();

  const copy = aboutCopy[locale];
  await connectToDatabase();
  const [rawSettings, rawTestimonials, rawFaqs] = await Promise.all([
    SiteSettingModel.findOne({ key: "site" }).select("shortName").lean(),
    TestimonialModel.find({ isActive: true }).sort({ sortOrder: 1 }).limit(6).lean(),
    FaqModel.find({ isActive: true }).sort({ sortOrder: 1 }).limit(8).lean(),
  ]);
  const settings = repairMojibakeDeep(rawSettings);
  const testimonials = repairMojibakeDeep(rawTestimonials);
  const faqs = repairMojibakeDeep(rawFaqs);

  return (
    <main lang={locale} className="min-h-screen bg-white text-slate-800">
      <FadeIn>
        <section className="relative isolate overflow-hidden bg-navy py-20 text-white sm:py-28">
          <LiveEnergyBackground />
          <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
              {settings?.shortName || "KPESH"}
            </p>
            <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">{copy.title}</h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/75">{copy.intro}</p>
          </div>
        </section>
      </FadeIn>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-start">
          <h2 className="text-3xl font-bold text-slate-900">
            {locale === "bn" ? "আমাদের লক্ষ্য" : "Our approach"}
          </h2>
          <p className="text-lg leading-8 text-slate-600">{copy.detail}</p>
        </div>
        <Stagger className="mt-12 grid gap-5 md:grid-cols-3">
          {copy.values.map(([title, detail]) => (
            <StaggerItem key={title}>
              <article className="h-full rounded-3xl border border-slate-200 bg-slate-50 p-6 transition-all duration-300 hover:border-brand/50 hover:bg-white hover:shadow-lg hover:shadow-navy/5">
                <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{detail}</p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {testimonials.length > 0 ? (
        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-slate-900">{copy.reviews}</h2>
            <Stagger className="mt-8 grid gap-5 md:grid-cols-2">
              {testimonials.map((item) => (
                <StaggerItem key={item._id.toString()}>
                  <blockquote className="h-full rounded-3xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:border-brand/50 hover:shadow-lg hover:shadow-navy/5">
                    <p className="leading-7 text-slate-700">
                      “{item.quote[locale] || item.quote.en || item.quote.bn}”
                    </p>
                    <footer className="mt-5 text-sm font-semibold text-brand-dark">
                      {item.name}
                    </footer>
                  </blockquote>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      ) : null}

      {faqs.length > 0 ? (
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900">{copy.faq}</h2>
          <Stagger className="mt-7 space-y-3">
            {faqs.map((item) => (
              <StaggerItem key={item._id.toString()}>
                <details className="rounded-2xl border border-slate-200 p-5">
                  <summary className="cursor-pointer font-semibold text-slate-900">
                    {item.question[locale] || item.question.en || item.question.bn}
                  </summary>
                  <p className="mt-3 leading-7 text-slate-600">
                    {item.answer[locale] || item.answer.en || item.answer.bn}
                  </p>
                </details>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 rounded-3xl bg-brand/15 p-7 sm:p-9 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-bold text-navy">{copy.contact}</h2>
          <Link
            href={`/${locale}/contact`}
            className="rounded-full bg-navy px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-navy-2"
          >
            {copy.contactLink} ↗
          </Link>
        </div>
      </section>
    </main>
  );
}
