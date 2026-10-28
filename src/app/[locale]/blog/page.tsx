import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { connectToDatabase } from "@/db/connection";
import { PostModel } from "@/db/models";
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
    path: "/blog",
    title: isBn ? "ব্লগ" : "Blog",
    description: isBn
      ? "বিদ্যুৎ ও এনার্জি প্রযুক্তি নিয়ে KPESH-এর নিবন্ধ।"
      : "KPESH articles about power and energy technology.",
  });
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function BlogPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  if (!SUPPORTED_LOCALES.includes(locale)) notFound();
  await connectToDatabase();
  const posts = repairMojibakeDeep(
    await PostModel.find({ status: "published" }).sort({ publishedAt: -1, createdAt: -1 }).lean(),
  );

  return (
    <main className="min-h-screen bg-white text-slate-800">
      <FadeIn>
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.25em] text-brand-dark">
            {locale === "bn" ? "ব্লগ" : "Blog"}
          </p>
          <h1 className="mt-4 text-center text-3xl font-bold text-slate-900 sm:text-5xl">
            {locale === "bn"
              ? "শক্তি ও প্রযুক্তি সম্পর্কে পাঠ"
              : "Insights on power and technology"}
          </h1>

          <Stagger className="mt-12 grid gap-6 min-[45rem]:grid-cols-2">
            {posts.map((post, index) => (
              <StaggerItem key={post._id.toString()} className="h-full" index={index}>
                <Link
                  href={`/${locale}/blog/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:border-brand/60 hover:shadow-xl hover:shadow-navy/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                >
                  <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-[radial-gradient(circle_at_70%_25%,rgba(57,198,190,0.28),transparent_35%),radial-gradient(circle_at_20%_90%,rgba(155,214,74,0.2),transparent_36%),linear-gradient(135deg,#092a32,#0c3940)]">
                    {post.cover.url ? (
                      <Image
                        src={post.cover.url}
                        alt={post.cover.alt[locale] || post.title[locale]}
                        width={post.cover.width || 1000}
                        height={post.cover.height || 650}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      />
                    ) : (
                      <div aria-hidden="true" className="flex h-full items-center justify-center">
                        <span className="text-5xl text-brand">KPESH</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-dark">
                      {post.publishedAt?.toLocaleDateString(locale)}
                    </p>
                    <h2 className="mt-3 line-clamp-2 min-h-[4.5rem] text-2xl font-semibold leading-9 text-slate-900 transition-colors group-hover:text-brand-dark">
                      {post.title[locale]}
                    </h2>
                    <p className="mt-3 line-clamp-3 min-h-[5.25rem] text-sm leading-7 text-slate-600">
                      {post.excerpt[locale]}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-brand-dark">
                      {locale === "bn" ? "আরও পড়ুন" : "Read more"}
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                      >
                        ↗
                      </span>
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
          {posts.length === 0 ? (
            <p className="mt-10 text-center text-slate-500">
              {locale === "bn"
                ? "এখনো কোনো নিবন্ধ প্রকাশ করা হয়নি।"
                : "No articles have been published yet."}
            </p>
          ) : null}
        </section>
      </FadeIn>
    </main>
  );
}
