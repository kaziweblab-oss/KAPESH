import { UsersManager } from "@/components/admin/users-manager";
import { connectToDatabase } from "@/db/connection";
import { UserModel } from "@/db/models";
import { requireRole } from "@/lib/auth";
import { getAdminLocale } from "@/lib/admin-i18n";

export default async function AdminUsersPage() {
  await requireRole(["admin"]);
  await connectToDatabase();
  const records = await UserModel.find({})
    .select("name email role isActive lastLoginAt")
    .sort({ createdAt: -1 })
    .lean();
  const users = JSON.parse(JSON.stringify(records)) as Parameters<typeof UsersManager>[0]["users"];
  return <UsersManager users={users} locale={await getAdminLocale()} />;
}
