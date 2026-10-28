"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminTranslate, type AdminLocale } from "@/lib/admin-i18n-core";

type AdminUser = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "author";
  isActive: boolean;
  lastLoginAt: string | null;
};

const roles = ["admin", "editor", "author"] as const;

export function UsersManager({ users, locale }: { users: AdminUser[]; locale: AdminLocale }) {
  const router = useRouter();
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>, id?: string) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const body = id
      ? {
          ...data,
          id,
          isActive: data.isActive === "on",
        }
      : { ...data, role: data.role || "editor" };

    setPending(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/users", {
        method: id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(result.error ?? "Unable to save user.");
        return;
      }
      setNotice(id ? "User updated." : "User created.");
      if (!id) form.reset();
      router.refresh();
    } catch (requestError) {
      console.error("User management request failed.", requestError);
      setError("Could not reach the server. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-8">
      <header className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-dark">
          {adminTranslate(locale, "Administration")}
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">{adminTranslate(locale, "User management")}</h1>
        <p className="mt-2 text-slate-600">
          {adminTranslate(locale, "Create accounts and assign admin, editor, or author access.")}
        </p>
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

      <form
        onSubmit={(event) => void submit(event)}
        className="grid gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-6 md:grid-cols-2"
      >
        <h2 className="text-lg font-semibold text-slate-900 md:col-span-2">{adminTranslate(locale, "Add user")}</h2>
        <label className="text-sm font-medium text-slate-700">
          {adminTranslate(locale, "Name")}
          <input
            name="name"
            required
            minLength={2}
            maxLength={80}
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          {adminTranslate(locale, "Email")}
          <input
            name="email"
            type="email"
            required
            maxLength={120}
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          {adminTranslate(locale, "Temporary password")}
          <input
            name="password"
            type="password"
            required
            minLength={8}
            maxLength={200}
            autoComplete="new-password"
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          {adminTranslate(locale, "Role")}
          <select
            name="role"
            defaultValue="editor"
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2"
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {adminTranslate(locale, role)}
              </option>
            ))}
          </select>
        </label>
        <button
          disabled={pending}
          className="w-fit rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? adminTranslate(locale, "Saving...") : adminTranslate(locale, "Create user")}
        </button>
      </form>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">{adminTranslate(locale, "Existing accounts")}</h2>
        {users.map((user) => (
          <form
            key={user._id}
            onSubmit={(event) => void submit(event, user._id)}
            className="grid gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-5 md:grid-cols-2"
          >
            <label className="text-sm font-medium text-slate-700">
              {adminTranslate(locale, "Name")}
              <input
                name="name"
                defaultValue={user.name}
                required
                minLength={2}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              {adminTranslate(locale, "Email")}
              <input
                name="email"
                type="email"
                defaultValue={user.email}
                required
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              {adminTranslate(locale, "Role")}
              <select
                name="role"
                defaultValue={user.role}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {adminTranslate(locale, role)}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 self-end pb-2 text-sm font-medium text-slate-700">
              <input
                name="isActive"
                type="checkbox"
                defaultChecked={user.isActive}
                className="h-4 w-4 accent-[#4d8d2a]"
              />
              {adminTranslate(locale, "Active account")}
            </label>
            <p className="text-xs text-slate-500 md:col-span-2">
              Last login: {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "Never"}
            </p>
            <button
              disabled={pending}
              className="w-fit rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 disabled:opacity-60"
            >
              {pending ? adminTranslate(locale, "Saving...") : adminTranslate(locale, "Save changes")}
            </button>
          </form>
        ))}
        {users.length === 0 ? (
          <p className="rounded-2xl bg-white p-6 text-sm text-slate-500">{adminTranslate(locale, "No accounts found.")}</p>
        ) : null}
      </section>
    </div>
  );
}
