import { MediaManager } from "@/components/admin/media-manager";
import { connectToDatabase } from "@/db/connection";
import { MediaModel } from "@/db/models";
import { requireRole } from "@/lib/auth";
import { getAdminLocale } from "@/lib/admin-i18n";

export default async function AdminMediaPage() {
  await requireRole(["admin", "editor"]);
  await connectToDatabase();
  const records = await MediaModel.find({})
    .sort({ createdAt: -1 })
    .limit(200)
    .select("url publicId alt width height mimeType size createdAt")
    .lean();
  const media = JSON.parse(JSON.stringify(records)) as Parameters<typeof MediaManager>[0]["media"];
  return <MediaManager media={media} locale={await getAdminLocale()} />;
}
