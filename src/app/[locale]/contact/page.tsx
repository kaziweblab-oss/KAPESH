import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { InquiryForm } from "@/components/public/inquiry-form";
import { FadeIn } from "@/components/ui/motion";
import { connectToDatabase } from "@/db/connection";
import { SiteSettingModel } from "@/db/models";
import { createPageMetadata } from "@/lib/seo";
import { SUPPORTED_LOCALES, type Locale } from "@/lib/site-content";
import { repairMojibakeDeep } from "@/lib/text-encoding";

export const dynamic = "force-dynamic";

const contactCopy = {
  bn: {
    title: "আপনার প্রজেক্ট নিয়ে কথা বলুন",
    intro: "আপনার বিদ্যুৎ বা এনার্জি সংক্রান্ত প্রয়োজন জানান। আমাদের টিম যোগাযোগ করবে।",
    details: "যোগাযোগের তথ্য",
    form: "বার্তা পাঠান",
    phone: "ফোন",
    email: "ইমেইল",
    address: "ঠিকানা",
  },
  en: {
    title: "Let's discuss your project",
    intro:
      "Tell us about your power or energy requirements. Our team will get in touch to help.",
    details: "Contact details",
    form: "Send us a message",
    phone: "Phone",
    email: "Email",
    address: "Address",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!SUPPORTED_LOCALES.includes(locale)) return {};
  return createPageMetadata({
    locale,
    path: "/contact",
    title: locale === "bn" ? "যোগাযোগ | KPESH" : "Contact KPESH",
    description: contactCopy[locale].intro,
  });
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function ContactPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  if (!SUPPORTED_LOCALES.includes(locale)) notFound();

  const copy = contactCopy[locale];
  await connectToDatabase();
  const settings = repairMojibakeDeep(
    await SiteSettingModel.findOne({ key: "site" }).select("shortName contact").lean(),
  );
  const contact = settings?.contact;
  const address = contact?.address?.[locale] || contact?.address?.en || contact?.address?.bn;

  return (
    <main lang={locale} className="min-h-screen bg-slate-50 text-slate-800">
      <FadeIn>
        <section className="bg-navy py-16 text-white sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
              {locale === "bn" ? "KPESH-এর সাথে যোগাযোগ" : "Get in touch with KPESH"}
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
              {copy.title}
            </h1>
            <p className="mt-5 max-w-2xl leading-7 text-white/75">{copy.intro}</p>
          </div>
        </section>
      </FadeIn>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-16">
        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold text-slate-900">{copy.details}</h2>
          <dl className="mt-6 space-y-5">
            {[
              [copy.phone, contact?.phone],
              [copy.email, contact?.email],
              [copy.address, address],
            ]
              .filter((entry): entry is [string, string] => Boolean(entry[1]))
              .map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs font-semibold uppercase tracking-widest text-brand-dark">
                    {label}
                  </dt>
                  <dd className="mt-1 break-words text-slate-700">
                    {label === copy.phone ? (
                      <a href={`tel:${value}`} className="hover:text-brand-dark">
                        {value}
                      </a>
                    ) : label === copy.email ? (
                      <a href={`mailto:${value}`} className="hover:text-brand-dark">
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              ))}
          </dl>
          {contact?.whatsapp ? (
            <a
              href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex rounded-full border border-brand px-5 py-2.5 text-sm font-semibold text-navy transition hover:bg-brand/15"
            >
              WhatsApp
            </a>
          ) : null}
          {contact?.mapUrl ? (
            <a
              href={contact.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 block text-sm font-semibold text-brand-dark hover:text-navy"
            >
              {locale === "bn" ? "ম্যাপে দেখুন" : "View on map"} ↗
            </a>
          ) : null}
        </aside>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 text-xl font-bold text-slate-900">{copy.form}</h2>
          <InquiryForm locale={locale} />
        </div>
      </section>
    </main>
  );
}
