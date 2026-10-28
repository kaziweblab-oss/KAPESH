import { connectToDatabase } from "@/db/connection";
import { InquiryModel, PostModel, ProductModel, ProjectModel, ServiceModel } from "@/db/models";
import { requireSession } from "@/lib/auth";
import { adminText, getAdminLocale } from "@/lib/admin-i18n";

export default async function AdminDashboardPage() {
  const session = await requireSession();
  await connectToDatabase();

  const [services, projects, products, inquiries, newInquiries, posts] = await Promise.all([
    ServiceModel.countDocuments({}),
    ProjectModel.countDocuments({}),
    ProductModel.countDocuments({}),
    InquiryModel.countDocuments({}),
    InquiryModel.countDocuments({ status: "new" }),
    PostModel.countDocuments({}),
  ]);
  const locale = await getAdminLocale();
  const stats = [
    { label: "servicesCount" as const, value: services },
    { label: "projectsCount" as const, value: projects },
    { label: "productsCount" as const, value: products },
    { label: "blogPosts" as const, value: posts },
    { label: "allInquiries" as const, value: inquiries },
    { label: "newInquiries" as const, value: newInquiries },
  ];

  return (
    <div className="space-y-8">
      <header className="dashboard-ambient relative isolate overflow-hidden rounded-[2rem] bg-navy p-7 text-white shadow-xl shadow-navy/10 sm:p-10">
        <div className="dashboard-orb dashboard-orb-one" aria-hidden="true" />
        <div className="dashboard-orb dashboard-orb-two" aria-hidden="true" />
        <div className="relative z-10 max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            <span className="h-2 w-2 rounded-full bg-brand shadow-[0_0_14px_var(--brand)]" />
            {locale === "bn" ? "কেপিইএসএইচ অ্যাডমিন" : "KPESH Admin"}
          </p>
          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
            {adminText(locale, "dashboard")}
          </h1>
          <p className="mt-2 text-white/70">
            {adminText(locale, "welcome")}, {session.name}. {adminText(locale, "dashboardIntro")}
          </p>
        </div>
        <div
          className="pointer-events-none absolute -right-10 -top-16 h-64 w-64 rounded-full border border-white/10"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-1 -top-7 h-44 w-44 rounded-full border border-brand/20"
          aria-hidden="true"
        />
      </header>

      <section aria-label="Site statistics" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group relative overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-lg"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand/30 via-brand to-brand-dark opacity-70 transition group-hover:opacity-100" />
            <p className="text-sm font-medium text-slate-500">{adminText(locale, stat.label)}</p>
            <p className="mt-4 text-4xl font-bold tracking-tight text-navy">{stat.value}</p>
            <div
              className="pointer-events-none absolute -bottom-8 -right-6 h-24 w-24 rounded-full bg-brand/10 transition duration-300 group-hover:scale-125"
              aria-hidden="true"
            />
          </div>
        ))}
      </section>
    </div>
  );
}
