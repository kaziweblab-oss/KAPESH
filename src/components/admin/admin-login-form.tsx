"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DecorativeVideoBackground } from "@/components/public/decorative-video-background";
import { LiveEnergyBackground } from "@/components/public/live-energy-background";

export function AdminLoginForm({
  backgroundVideoUrl,
  logo,
  shortName = "KPESH",
}: {
  backgroundVideoUrl?: string;
  logo?: { url?: string; alt?: { bn?: string; en?: string } } | null;
  shortName?: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const payload = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setError(payload.error ?? "Invalid login.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="public-hero-ambient relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-navy px-4 py-12">
      <div className="public-hero-orb public-hero-orb-one" aria-hidden="true" />
      <div className="public-hero-orb public-hero-orb-two" aria-hidden="true" />
      <DecorativeVideoBackground videoUrl={backgroundVideoUrl} />
      <LiveEnergyBackground />
      <div className="relative z-10 w-full max-w-md rounded-[2rem] border border-white/50 bg-white/95 p-8 shadow-2xl shadow-navy/25 backdrop-blur-xl">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-brand/30 bg-navy text-xl font-bold text-brand shadow-[0_0_24px_rgba(155,214,74,0.18)]">
            {logo?.url ? <img src={logo.url} alt={logo.alt?.en || shortName} className="h-full w-full rounded-full object-contain p-1" /> : "K"}
          </div>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.25em] text-brand-dark">
            {shortName} Admin
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">Sign in</h1>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-700">
            Email
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              type="email"
              required
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Password
            <span className="relative mt-2 block">
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-12 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-slate-500 transition hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-brand"
              >
                {showPassword ? (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.2A10.7 10.7 0 0112 5c5.2 0 8.5 4.7 9.5 6.4a1.2 1.2 0 010 1.2 16.4 16.4 0 01-3 3.7M6.2 6.2a16.6 16.6 0 00-3.7 5.2 1.2 1.2 0 000 1.2C3.5 14.3 6.8 19 12 19c1.2 0 2.3-.3 3.3-.7"
                    />
                  </svg>
                ) : (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.5 12s3.4-7 9.5-7 9.5 7 9.5 7-3.4 7-9.5 7-9.5-7-9.5-7z"
                    />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </span>
          </label>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-xl border border-brand bg-brand px-5 py-3 text-sm font-semibold text-navy transition hover:border-brand-dark hover:bg-brand/90 hover:shadow-[0_0_0_4px_rgba(155,214,74,0.16)] disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          <Link href="/bn" className="font-semibold text-brand-dark transition hover:text-navy">
            Return to site
          </Link>
        </div>
      </div>
    </main>
  );
}
