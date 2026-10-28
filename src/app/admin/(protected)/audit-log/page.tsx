import { connectToDatabase } from "@/db/connection";
import { AuditLogModel } from "@/db/models";
import { requireRole } from "@/lib/auth";
import { getAdminLocale } from "@/lib/admin-i18n";
import { adminTranslate } from "@/lib/admin-i18n-core";

export default async function AdminAuditLogPage() {
  await requireRole(["admin"]);
  await connectToDatabase();
  const records = await AuditLogModel.find({})
    .sort({ createdAt: -1 })
    .limit(100)
    .populate("user", "name email")
    .lean();
  const logs = JSON.parse(JSON.stringify(records)) as {
    _id: string;
    action: string;
    collectionName: string;
    documentId: string;
    user?: { name?: string; email?: string } | null;
    createdAt: string;
    before?: unknown;
    after?: unknown;
  }[];
  const locale = await getAdminLocale();

  return (
    <div className="space-y-6">
      <header className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-dark">
          {adminTranslate(locale, "Administration")}
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">{adminTranslate(locale, "Audit log")}</h1>
        <p className="mt-2 text-slate-600">{adminTranslate(locale, "Recent changes made in the admin panel.")}</p>
      </header>

      <div className="space-y-3">
        {logs.map((log) => (
          <details
            key={log._id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-3">
              <span className="font-semibold capitalize text-slate-900">
                {log.action} {log.collectionName}
              </span>
              <span className="text-xs text-slate-500">
                {log.user?.name || "Unknown user"} · {new Date(log.createdAt).toLocaleString()}
              </span>
            </summary>
            <p className="mt-3 text-xs text-slate-500">Document ID: {log.documentId || "—"}</p>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {locale === "bn" ? "আগে" : "Before"}
                </h2>
                <pre className="mt-2 max-h-64 overflow-auto rounded-xl bg-slate-50 p-3 text-xs text-slate-700">
                  {log.before ? JSON.stringify(log.before, null, 2) : "—"}
                </pre>
              </div>
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {locale === "bn" ? "পরে" : "After"}
                </h2>
                <pre className="mt-2 max-h-64 overflow-auto rounded-xl bg-slate-50 p-3 text-xs text-slate-700">
                  {log.after ? JSON.stringify(log.after, null, 2) : "—"}
                </pre>
              </div>
            </div>
          </details>
        ))}
        {logs.length === 0 ? (
          <p className="rounded-2xl bg-white p-6 text-sm text-slate-500">
            {locale === "bn" ? "এখনও কোনো পরিবর্তন রেকর্ড করা হয়নি।" : "No changes recorded yet."}
          </p>
        ) : null}
      </div>
    </div>
  );
}
