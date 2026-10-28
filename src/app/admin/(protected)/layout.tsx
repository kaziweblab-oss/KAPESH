import Link from "next/link";
import { redirect } from "next/navigation";
import { clearSession, requireSession, type UserRole } from "@/lib/auth";
import { AdminMobileNavigation } from "@/components/admin/admin-mobile-navigation";
import { adminText, getAdminLocale } from "@/lib/admin-i18n";
import { connectToDatabase } from "@/db/connection";
import { SiteSettingModel } from "@/db/models";

type AdminNavItem = {
  href: string;
  label: string;
  roles: readonly UserRole[];
};

const navigation: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", roles: ["admin", "editor", "author"] },
  { href: "/admin/settings", label: "Settings", roles: ["admin"] },
  { href: "/admin/categories", label: "Categories", roles: ["admin", "editor"] },
  { href: "/admin/services", label: "Services", roles: ["admin", "editor"] },
  { href: "/admin/projects", label: "Projects", roles: ["admin", "editor"] },
  { href: "/admin/products", label: "Products", roles: ["admin", "editor"] },
  { href: "/admin/blog", label: "Blog", roles: ["admin", "editor", "author"] },
  { href: "/admin/testimonials", label: "Testimonials", roles: ["admin", "editor"] },
  { href: "/admin/faqs", label: "FAQs", roles: ["admin", "editor"] },
  { href: "/admin/navigation", label: "Navigation", roles: ["admin"] },
  { href: "/admin/media", label: "Media", roles: ["admin", "editor"] },
  { href: "/admin/inquiries", label: "Inquiries", roles: ["admin", "editor"] },
  { href: "/admin/users", label: "Users", roles: ["admin"] },
  { href: "/admin/audit-log", label: "Audit log", roles: ["admin"] },
];

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();

  async function handleLogout() {
    "use server";
    await clearSession();
    redirect("/admin/login");
  }

  const visibleNavigation = navigation.filter((item) => item.roles.includes(session.role));
  const locale = await getAdminLocale();
  await connectToDatabase();
  const settings = await SiteSettingModel.findOne({ key: "site" }).select("logo shortName").lean();
  const t = (key: Parameters<typeof adminText>[1]) => adminText(locale, key);
  const navKeys: Record<string, Parameters<typeof adminText>[1]> = {
    "/admin": "dashboard",
    "/admin/settings": "settings",
    "/admin/categories": "categories",
    "/admin/services": "services",
    "/admin/projects": "projects",
    "/admin/products": "products",
    "/admin/blog": "blog",
    "/admin/testimonials": "testimonials",
    "/admin/faqs": "faqs",
    "/admin/navigation": "navigation",
    "/admin/media": "media",
    "/admin/inquiries": "inquiries",
    "/admin/users": "users",
    "/admin/audit-log": "auditLog",
  };
  const localizedNavigation = visibleNavigation.map((item) => ({
    ...item,
    label: t(navKeys[item.href]),
  }));

  return (
    <div className="admin-shell min-h-screen bg-[#eef5f3] text-slate-800">
      <aside className="admin-sidebar fixed inset-y-0 left-0 hidden w-72 flex-col border-r border-white/10 bg-navy p-6 text-white shadow-2xl shadow-navy/20 lg:flex">
        <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-brand/30 bg-brand/10 text-lg font-bold text-brand shadow-[0_0_24px_rgba(155,214,74,0.12)]">
          {settings?.logo?.url ? (
            <img src={settings.logo.url} alt={settings.logo.alt?.[locale] || settings.shortName || "KPESH"} className="h-full w-full rounded-full object-contain p-1" />
          ) : "K"}
        </div>
        <div>
          <p className="text-lg font-bold text-white">{settings?.shortName || "KPESH"}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">{t("adminConsole")}</p>
          </div>
        </div>

        <div className="mt-10 border-y border-white/10 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand/80">
            {t("contentStudio")}
          </p>
        </div>
        <nav className="admin-sidebar-scroll mt-4 min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-2">
          {localizedNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex cursor-pointer items-center rounded-xl border border-transparent px-4 py-3 text-sm font-medium text-white/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/60 hover:bg-brand/15 hover:pl-5 hover:text-brand hover:shadow-[0_8px_24px_rgba(155,214,74,0.12)] focus-visible:outline-2 focus-visible:outline-brand"
            >
              <span className="mr-3 h-1.5 w-1.5 rounded-full bg-white/25 transition group-hover:bg-brand group-hover:shadow-[0_0_10px_var(--brand)]" />
              {item.label}
            </Link>
          ))}
        </nav>

        <form action={handleLogout} className="mt-8 border-t border-white/10 pt-6">
          <button
            type="submit"
            className="w-full cursor-pointer rounded-xl border border-red-300/35 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-200 transition hover:border-red-300 hover:bg-red-500 hover:text-white focus-visible:outline-2 focus-visible:outline-red-300"
          >
            {t("logout")}
          </button>
        </form>
      </aside>

      <div className="lg:pl-72">
        <header className="admin-topbar sticky top-0 z-30 border-b border-white/70 bg-white/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-dark">KPESH CMS</p>
              <p className="mt-1 text-xs text-slate-500">{t("cmsSubtitle")}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-brand/30 bg-brand/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-dark">
                {session.role}
              </span>
              <span className="hidden text-sm font-medium text-slate-700 sm:inline">{session.name}</span>
              <AdminMobileNavigation
                items={localizedNavigation.map(({ href, label }) => ({ href, label }))}
                logoutAction={handleLogout}
                locale={locale}
                labels={{
                  openNavigation: t("openNavigation"),
                  closeNavigation: t("closeNavigation"),
                  adminConsole: t("adminConsole"),
                  theme: t("theme"),
                  logout: t("logout"),
                }}
                logo={settings?.logo}
                shortName={settings?.shortName}
              />
            </div>
          </div>
        </header>
        <main className="admin-main-scroll mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
