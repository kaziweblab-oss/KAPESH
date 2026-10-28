import { notFound } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { SiteFooter } from "@/components/public/site-footer";
import { HomePublicHeader } from "@/components/public/home-public-header";
import { connectToDatabase } from "@/db/connection";
import { SiteSettingModel } from "@/db/models";
import { SUPPORTED_LOCALES } from "@/lib/site-content";
import { repairMojibakeDeep } from "@/lib/text-encoding";

export const dynamic = "force-dynamic";

type ThemeVariables = CSSProperties & {
  "--navy": string;
  "--navy-2": string;
  "--brand": string;
  "--brand-dark": string;
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = SUPPORTED_LOCALES.find((supportedLocale) => supportedLocale === localeParam);
  if (!locale) notFound();

  await connectToDatabase();
  const settings = repairMojibakeDeep(
    await SiteSettingModel.findOne({ key: "site" }).select("theme logo shortName").lean(),
  );
  const theme: ThemeVariables = {
    "--navy": settings?.theme?.navy || "#092a32",
    "--navy-2": settings?.theme?.navy2 || "#0c3940",
    "--brand": settings?.theme?.brand || "#9bd64a",
    "--brand-dark": settings?.theme?.brandDark || "#4d8d2a",
  };

  return (
    <div className={`locale-${locale}`} lang={locale} style={theme}>
      <HomePublicHeader
        locale={locale}
        logo={settings?.logo}
        shortName={settings?.shortName}
      />
      {children}
      <SiteFooter locale={locale} logo={settings?.logo} shortName={settings?.shortName} />
    </div>
  );
}
