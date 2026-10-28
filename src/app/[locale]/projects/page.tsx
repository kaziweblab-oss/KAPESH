import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { connectToDatabase } from "@/db/connection";
import { ProjectModel } from "@/db/models";
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
    path: "/projects",
    title: isBn ? "প্রকল্পসমূহ" : "Projects",
    description: isBn
      ? "KPESH-এর সম্পন্ন বিদ্যুৎ ও সোলার প্রকল্পসমূহ।"
      : "Completed power and solar projects by KPESH.",
  });
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  if (!SUPPORTED_LOCALES.includes(locale)) notFound();
  await connectToDatabase();
  const projects = repairMojibakeDeep(
    await ProjectModel.find({ isActive: true }).sort({ featured: -1, sortOrder: 1 }).lean(),
  );

  return (
    <main className="min-h-screen bg-white text-slate-800">
      <FadeIn>
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.25em] text-brand-dark">
            {locale === "bn" ? "প্রকল্প" : "Projects"}
          </p>
          <h1 className="mt-4 text-center text-3xl font-bold text-slate-900 sm:text-5xl">
            {locale === "bn" ? "আমাদের কাজের নমুনা" : "Our recent work"}
          </h1>

          <Stagger className="mt-12 grid gap-6 min-[45rem]:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <StaggerItem key={project._id.toString()} className="h-full" index={index}>
                <Link
                  href={`/${locale}/projects/${project.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:border-brand/60 hover:shadow-xl hover:shadow-navy/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                >
                  <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-[radial-gradient(circle_at_70%_25%,rgba(57,198,190,0.28),transparent_35%),radial-gradient(circle_at_20%_90%,rgba(155,214,74,0.2),transparent_36%),linear-gradient(135deg,#092a32,#0c3940)]">
                    {project.cover.url ? (
                      <Image
                        src={project.cover.url}
                        alt={project.cover.alt[locale] || project.title[locale]}
                        width={project.cover.width || 900}
                        height={project.cover.height || 650}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      />
                    ) : (
                      <div aria-hidden="true" className="flex h-full items-center justify-center">
                        <span className="text-5xl text-brand">⚡</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <h2 className="min-h-[3.5rem] text-xl font-semibold leading-7 text-slate-900 transition-colors group-hover:text-brand-dark">
                      {project.title[locale]}
                    </h2>
                    <p className="mt-3 line-clamp-3 min-h-[5.25rem] text-sm leading-7 text-slate-600">
                      {project.excerpt[locale]}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-brand-dark">
                      {locale === "bn" ? "বিস্তারিত দেখুন" : "View project"}
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
          {projects.length === 0 ? (
            <p className="mt-10 text-center text-slate-500">
              {locale === "bn"
                ? "এখনো কোনো প্রকল্প যোগ করা হয়নি।"
                : "No projects have been added yet."}
            </p>
          ) : null}
        </section>
      </FadeIn>
    </main>
  );
}
