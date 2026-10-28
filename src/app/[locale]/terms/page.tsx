import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SUPPORTED_LOCALES, type Locale } from "@/lib/site-content";
import { createPageMetadata } from "@/lib/seo";

export function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  return params.then(({ locale }) => {
    if (!SUPPORTED_LOCALES.includes(locale)) return {};
    return createPageMetadata({
      locale,
      path: "/terms",
      title: locale === "bn" ? "ব্যবহারের শর্তাবলি" : "Terms of Use",
      description:
        locale === "bn"
          ? "KPESH ওয়েবসাইট ব্যবহারের শর্তাবলি।"
          : "Terms for using the KPESH website.",
    });
  });
}

export default async function TermsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  if (!SUPPORTED_LOCALES.includes(locale)) notFound();
  const isBn = locale === "bn";
  return (
    <main lang={locale} className="mx-auto min-h-screen max-w-3xl px-4 py-12 text-slate-800">
      <Link href={`/${locale}`} className="text-sm font-semibold text-brand-dark">
        {isBn ? "← হোমে ফিরুন" : "← Back home"}
      </Link>
      <h1 className="mt-8 text-3xl font-bold">{isBn ? "ব্যবহারের শর্তাবলি" : "Terms of Use"}</h1>
      <p className="mt-6 leading-8 text-slate-600">
        {isBn
          ? "এই ওয়েবসাইটে প্রদর্শিত পণ্যের বিবরণ ও মূল্য তথ্য পরিবর্তিত হতে পারে। ক্রয় বা কাজের চূড়ান্ত শর্ত, মূল্য, সরবরাহ ও ওয়ারেন্টি নিশ্চিত করতে KPESH-এর সঙ্গে সরাসরি যোগাযোগ করুন।"
          : "Product details and prices shown on this website may change. Contact KPESH directly to confirm final pricing, availability, delivery, warranty, and service terms before making a purchase."}
      </p>
      <p className="mt-4 leading-8 text-slate-600">
        {isBn
          ? "ওয়েবসাইটের কনটেন্ট অনুমতি ছাড়া পুনঃপ্রকাশ করা যাবে না। সাইটের কার্যকারিতা বা নিরাপত্তায় হস্তক্ষেপের চেষ্টা করবেন না।"
          : "Website content may not be republished without permission. Do not attempt to interfere with the site's availability or security."}
      </p>
    </main>
  );
}
