import { InquiriesManager } from "@/components/admin/inquiries-manager";
import { connectToDatabase } from "@/db/connection";
import { InquiryModel } from "@/db/models";
import { requireRole } from "@/lib/auth";
import { getAdminLocale } from "@/lib/admin-i18n";

export default async function AdminInquiriesPage() {
  await requireRole(["admin", "editor"]);
  await connectToDatabase();
  const records = await InquiryModel.find({}).sort({ createdAt: -1 }).limit(200).lean();
  const inquiries = JSON.parse(JSON.stringify(records)) as Parameters<
    typeof InquiriesManager
  >[0]["inquiries"];
  return <InquiriesManager inquiries={inquiries} locale={await getAdminLocale()} />;
}
