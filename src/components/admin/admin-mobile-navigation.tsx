"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type ThemeMode = "system" | "light" | "dark";

type AdminMobileNavigationProps = {
  items: { href: string; label: string }[];
  logoutAction: (formData: FormData) => void | Promise<void>;
  locale: "en" | "bn";
  labels: {
    openNavigation: string;
    closeNavigation: string;
    adminConsole: string;
    theme: string;
    logout: string;
  };
  logo?: { url?: string; alt?: { bn?: string; en?: string } } | null;
  shortName?: string;
};

export function AdminMobileNavigation({ items, logoutAction, locale, labels, logo, shortName = "KPESH" }: AdminMobileNavigationProps) {
  const [open, setOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  function applyTheme(mode: ThemeMode) {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const isDark = mode === "dark" || (mode === "system" && mediaQuery.matches);
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.dataset.theme = mode;
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
    window.localStorage.setItem("kpesh-theme", mode);
    setThemeMode(mode);
    setThemeMenuOpen(false);
  }

  useEffect(() => {
    const stored = window.localStorage.getItem("kpesh-theme");
    const mode: ThemeMode =
      stored === "light" || stored === "dark" ? stored : "system";
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const syncThemeMode = window.setTimeout(() => {
      setMounted(true);
      setThemeMode(mode);
    }, 0);
    const syncSystemTheme = () => {
      if (mode === "system") applyTheme("system");
    };

    syncSystemTheme();
    mediaQuery.addEventListener("change", syncSystemTheme);
    return () => {
      window.clearTimeout(syncThemeMode);
      mediaQuery.removeEventListener("change", syncSystemTheme);
    };
  }, []);

  function toggleLocale() {
    document.cookie = `kpesh-admin-locale=${locale === "en" ? "bn" : "en"}; path=/; max-age=31536000`;
    window.location.reload();
  }

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!themeMenuOpen) return;

    function handleThemeMenuKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setThemeMenuOpen(false);
    }

    function handlePointerDown(event: PointerEvent) {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setThemeMenuOpen(false);
      }
    }

    document.addEventListener("keydown", handleThemeMenuKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleThemeMenuKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [themeMenuOpen]);

  return (
    <>
      <button
        type="button"
        aria-label="Toggle admin language"
        onClick={toggleLocale}
        className="flex h-10 cursor-pointer items-center rounded-xl border border-slate-200/80 bg-white/80 px-2.5 text-xs font-bold text-navy transition hover:border-brand hover:bg-brand/10 focus-visible:outline-2 focus-visible:outline-brand lg:hidden"
      >
        {locale === "en" ? "বাংলা" : "EN"}
      </button>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="admin-mobile-navigation"
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 text-navy transition hover:border-brand hover:bg-brand/10 focus-visible:outline-2 focus-visible:outline-brand lg:hidden"
      >
        <span className="sr-only">{labels.openNavigation}</span>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
          <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      {mounted
        ? createPortal(
            <div
              className={`fixed inset-0 z-50 transition-[visibility,opacity] duration-300 lg:hidden ${
                open ? "visible opacity-100" : "invisible pointer-events-none opacity-0"
              }`}
              aria-hidden={!open}
            >
              <button
                type="button"
                aria-label={labels.closeNavigation}
                onClick={() => setOpen(false)}
                className="absolute inset-0 h-full w-full cursor-pointer bg-slate-950/45"
              />
              <aside
                id="admin-mobile-navigation"
                style={{
                  transform: open ? "translateX(0)" : "translateX(-100%)",
                  translate: "none",
                }}
                className="admin-sidebar absolute inset-y-0 left-0 right-auto z-10 flex w-[min(84vw,22rem)] flex-col overflow-y-auto p-5 text-white shadow-2xl transition-transform duration-300 motion-reduce:transition-none sm:p-6"
              >
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-brand/30 bg-brand/10 text-sm font-bold text-brand">
                  {logo?.url ? <img src={logo.url} alt={logo.alt?.[locale] || shortName} className="h-full w-full rounded-full object-contain p-1" /> : "K"}
                </span>
                <p className="text-sm font-bold tracking-[0.18em] text-brand">{shortName}</p>
              </div>
              <p className="mt-1 text-xs text-white/55">{labels.adminConsole}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/15 text-white transition hover:rotate-90 hover:border-brand hover:bg-brand/15 hover:text-brand focus-visible:outline-2 focus-visible:outline-brand"
            >
              <span className="sr-only">{labels.closeNavigation}</span>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                <path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          <nav className="mt-5 space-y-1.5">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="group flex cursor-pointer items-center rounded-xl border border-transparent px-4 py-3 text-sm font-medium text-white/75 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/35 hover:bg-white/10 hover:pl-5 hover:text-brand hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] focus-visible:outline-2 focus-visible:outline-brand"
              >
                <span className="mr-3 h-1.5 w-1.5 rounded-full bg-white/25 transition group-hover:bg-brand" />
                {item.label}
              </Link>
            ))}
          </nav>
          <form action={logoutAction} className="mt-auto border-t border-white/10 pt-6">
            <div ref={themeMenuRef} className="relative mb-3">
              <button
                type="button"
                aria-expanded={themeMenuOpen}
                aria-haspopup="menu"
                onClick={() => setThemeMenuOpen((current) => !current)}
                className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/80 transition hover:border-brand/50 hover:bg-brand/10 hover:text-brand focus-visible:outline-2 focus-visible:outline-brand"
              >
                <span>{labels.theme}</span>
                <span className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-brand">
                  {themeMode}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      themeMenuOpen ? "rotate-180" : ""
                    }`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m3.5 6 4.5 4 4.5-4" />
                  </svg>
                </span>
              </button>
              {themeMenuOpen ? (
                <div
                  role="menu"
                  aria-label={labels.theme}
                  className="absolute bottom-[calc(100%+0.6rem)] left-0 z-20 w-full overflow-hidden rounded-2xl border border-white/15 bg-[#103b42]/95 p-1.5 text-sm text-white shadow-xl shadow-black/20 backdrop-blur-xl"
                >
                  {(["system", "light", "dark"] as ThemeMode[]).map((mode) => {
                    const label =
                      mode === "system"
                        ? locale === "bn"
                          ? "সিস্টেম"
                          : "System"
                        : mode === "dark"
                          ? locale === "bn"
                            ? "ডার্ক"
                            : "Dark"
                          : locale === "bn"
                            ? "লাইট"
                            : "Light";
                    return (
                      <button
                        key={mode}
                        type="button"
                        role="menuitemradio"
                        aria-checked={themeMode === mode}
                        onClick={() => applyTheme(mode)}
                        className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-brand ${
                          themeMode === mode
                            ? "bg-brand/15 font-semibold text-brand"
                            : "text-white/75 hover:bg-white/10 hover:text-brand"
                        }`}
                      >
                        {label}
                        {themeMode === mode ? <span aria-hidden="true">✓</span> : null}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
            <button
              type="submit"
              className="w-full cursor-pointer rounded-xl border border-red-300/35 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-200 transition hover:border-red-300 hover:bg-red-500 hover:text-white focus-visible:outline-2 focus-visible:outline-red-300"
            >
              {labels.logout}
            </button>
          </form>
              </aside>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
