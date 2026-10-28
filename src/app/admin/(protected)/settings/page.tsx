import { connectToDatabase } from "@/db/connection";
import { SiteSettingModel } from "@/db/models";
import { requireRole } from "@/lib/auth";
import { SettingsForm } from "@/components/admin/settings-form";
import { getAdminLocale } from "@/lib/admin-i18n";
import { adminTranslate } from "@/lib/admin-i18n-core";

export default async function AdminSettingsPage() {
  await requireRole(["admin"]);
  await connectToDatabase();
  const settings = await SiteSettingModel.findOne({ key: "site" }).lean();
  const initial = settings ? (JSON.parse(JSON.stringify(settings)) as Parameters<typeof SettingsForm>[0]["initial"]) : null;
  const locale = await getAdminLocale();

  return (
    <div className="space-y-6">
      <header className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-dark">{adminTranslate(locale, "Administration")}</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">{adminTranslate(locale, "Site settings")}</h1>
        <p className="mt-2 text-slate-600">{adminTranslate(locale, "Update the site identity, contact details, theme, social links, and SEO values.")}</p>
      </header>
      <SettingsForm initial={initial} locale={locale} />
    </div>
  );
}
