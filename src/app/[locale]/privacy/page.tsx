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
      path: "/privacy",
      title: locale === "bn" ? "গোপনীয়তা নীতি" : "Privacy Policy",
      description:
        locale === "bn"
          ? "KPESH-এর গোপনীয়তা নীতি।"
          : "How KPESH handles information submitted through this website.",
    });
  });
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  if (!SUPPORTED_LOCALES.includes(locale)) notFound();
  const isBn = locale === "bn";
  return (
    <main lang={locale} className="mx-auto min-h-screen max-w-3xl px-4 py-12 text-slate-800">
      <Link href={`/${locale}`} className="text-sm font-semibold text-brand-dark">
        {isBn ? "← হোমে ফিরুন" : "← Back home"}
      </Link>
      <h1 className="mt-8 text-3xl font-bold">{isBn ? "গোপনীয়তা নীতি" : "Privacy Policy"}</h1>
      <p className="mt-6 leading-8 text-slate-600">
        {isBn
          ? "আপনি যোগাযোগের ফর্মে যে নাম, ফোন, ইমেইল ও বার্তা দেন, তা আপনার অনুরোধের উত্তর দিতে সংরক্ষণ করা হয়। এই তথ্য বিক্রি করা হয় না। সাইটের নিরাপত্তা ও স্প্যাম প্রতিরোধে সীমিত প্রযুক্তিগত তথ্য ব্যবহৃত হতে পারে। তথ্য সংশোধন বা মুছে ফেলার অনুরোধ করতে আমাদের সঙ্গে যোগাযোগ করুন।"
          : "Information you submit through the contact form (such as your name, phone number, email, and message) is stored so we can respond to your request. We do not sell this information. Limited technical data may be used to protect the site and prevent spam. Contact us to request correction or deletion of your inquiry."}
      </p>
      <p className="mt-4 leading-8 text-slate-600">
        {isBn
          ? "ছবি ও পৃষ্ঠা লোডের জন্য তৃতীয় পক্ষের হোস্টিং সেবা ব্যবহৃত হতে পারে। তাদের নিজস্ব নীতি প্রযোজ্য।"
          : "Third-party hosting providers may process media and website requests. Their own privacy terms may apply."}
      </p>
    </main>
  );
}
