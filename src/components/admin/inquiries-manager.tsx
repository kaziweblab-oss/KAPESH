"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminTranslate, type AdminLocale } from "@/lib/admin-i18n-core";

type Inquiry = {
  _id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  notes: string;
  createdAt: string;
};

const statuses = ["new", "read", "replied", "archived"] as const;

export function InquiriesManager({ inquiries, locale }: { inquiries: Inquiry[]; locale: AdminLocale }) {
  const router = useRouter();
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [pendingId, setPendingId] = useState("");

  async function update(event: React.FormEvent<HTMLFormElement>, item: Inquiry) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPendingId(item._id);
    setError("");
    setNotice("");

    try {
      const response = await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item._id,
          status: data.get("status"),
          notes: data.get("notes"),
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(result.error ?? "Unable to update inquiry.");
        return;
      }
      setNotice("Inquiry updated.");
      router.refresh();
    } catch (requestError) {
      console.error("Inquiry update request failed.", requestError);
      setError("Could not reach the server. Please try again.");
    } finally {
      setPendingId("");
    }
  }

  function exportCsv() {
    const columns = ["Created", "Name", "Phone", "Email", "Service", "Message", "Status", "Notes"];
    const escapeCell = (value: string) => {
      const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
      return `"${safe.replaceAll('"', '""')}"`;
    };
    const rows = inquiries.map((item) => [
      item.createdAt,
      item.name,
      item.phone,
      item.email,
      item.service,
      item.message,
      item.status,
      item.notes,
    ]);
    const csv = [columns, ...rows].map((row) => row.map(escapeCell).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `kpesh-inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className="space-y-6">
      <header className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-dark">
          {adminTranslate(locale, "Customer messages")}
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">{adminTranslate(locale, "Inquiries")}</h1>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <p className="text-slate-600">{inquiries.length} most recent inquiries</p>
          <button
            type="button"
            onClick={exportCsv}
            disabled={inquiries.length === 0}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
          >
            {adminTranslate(locale, "Export CSV")}
          </button>
        </div>
      </header>
      {notice ? (
        <p role="status" className="rounded-xl bg-brand/10 px-4 py-3 text-sm text-navy">
          {notice}
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <div className="space-y-4">
        {inquiries.map((item) => (
          <form
            key={item._id}
            onSubmit={(event) => void update(event, item)}
            className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{item.name}</h2>
                <p className="mt-1 text-sm text-slate-600">
                  <a href={`tel:${item.phone}`} className="hover:text-brand-dark">
                    {item.phone}
                  </a>
                  {item.email ? (
                    <>
                      {" "}
                      ·{" "}
                      <a href={`mailto:${item.email}`} className="hover:text-brand-dark">
                        {item.email}
                      </a>
                    </>
                  ) : null}
                </p>
              </div>
              <p className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
            </div>
            {item.service ? (
              <p className="mt-3 text-sm font-medium text-brand-dark">{item.service}</p>
            ) : null}
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">
              {item.message}
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-[200px_1fr_auto] sm:items-end">
              <label className="text-sm font-medium text-slate-700">
                {adminTranslate(locale, "Status")}
                <select
                  name="status"
                  defaultValue={item.status}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {adminTranslate(locale, status)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium text-slate-700">
                {adminTranslate(locale, "Internal notes")}
                <input
                  name="notes"
                  defaultValue={item.notes}
                  maxLength={2000}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2"
                />
              </label>
              <button
                disabled={pendingId === item._id}
                className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {pendingId === item._id ? adminTranslate(locale, "Saving...") : adminTranslate(locale, "Save")}
              </button>
            </div>
          </form>
        ))}
        {inquiries.length === 0 ? (
          <p className="rounded-2xl bg-white p-6 text-sm text-slate-500">
            {adminTranslate(locale, "No inquiries received yet.")}
          </p>
        ) : null}
      </div>
    </div>
  );
}
