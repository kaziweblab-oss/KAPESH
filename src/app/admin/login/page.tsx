import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { connectToDatabase } from "@/db/connection";
import { SiteSettingModel } from "@/db/models";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  await connectToDatabase();
  const settings = await SiteSettingModel.findOne({ key: "site" })
    .select("backgroundVideo.url logo shortName")
    .lean();

  return <AdminLoginForm backgroundVideoUrl={settings?.backgroundVideo?.url} logo={settings?.logo} shortName={settings?.shortName} />;
}
