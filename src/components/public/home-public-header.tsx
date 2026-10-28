"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent } from "react";
import type { Locale } from "@/lib/site-content";

type HeaderLogo = {
  url?: string;
  width?: number;
  height?: number;
  alt?: { bn?: string; en?: string };
};

type ThemeMode = "system" | "light" | "dark";

export function HomePublicHeader({
  locale,
  logo,
  shortName = "KPESH",
}: {
  locale: Locale;
  logo?: HeaderLogo | null;
  shortName?: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isBn = locale === "bn";
  const localizedPath =
    pathname.replace(/^\/(bn|en)(?=\/|$)/, "") || "";
  const alternateLocale = isBn ? "en" : "bn";
  const navItems = [
    { label: isBn ? "হোম" : "Home", href: `/${locale}` },
    { label: isBn ? "সেবা" : "Services", href: `/${locale}/services` },
    { label: isBn ? "পণ্য" : "Products", href: `/${locale}/products` },
    { label: isBn ? "প্রকল্প" : "Projects", href: `/${locale}/projects` },
    { label: isBn ? "ব্লগ" : "Blog", href: `/${locale}/blog` },
    { label: isBn ? "আমাদের সম্পর্কে" : "About", href: `/${locale}/about` },
    { label: isBn ? "যোগাযোগ" : "Contact", href: `/${locale}/contact` },
  ];

  function handleNavigationPointerMove(event: MouseEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const blades = event.currentTarget.querySelectorAll<HTMLElement>(
      ".mobile-navigation-grass-blade",
    );

    blades.forEach((blade, index) => {
      const bladeX = ((index + 0.5) / blades.length) * bounds.width;
      const bladeY = bounds.height * (1 - Number(blade.dataset.heightRatio ?? 0.5));
      const distance = x - bladeX;
      const verticalInfluence = Math.max(0.35, 1 - Math.abs(y - bladeY) / 360);
      const influence = Math.max(0, 1 - Math.abs(distance) / 185) * verticalInfluence;
      const wave = Math.max(-24, Math.min(24, distance * 0.2 * influence));
      blade.style.setProperty("--blade-wind", `${wave.toFixed(2)}deg`);
    });
  }

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("kpesh-theme");
    const mode: ThemeMode =
      storedTheme === "light" || storedTheme === "dark" ? storedTheme : "system";
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      const isDark =
        mode === "dark" || (mode === "system" && mediaQuery.matches);
      document.documentElement.classList.toggle("dark", isDark);
      document.documentElement.dataset.theme = mode;
      document.documentElement.style.colorScheme = isDark ? "dark" : "light";
    };

    const syncThemeMode = window.setTimeout(() => setThemeMode(mode), 0);
    applyTheme();
    mediaQuery.addEventListener("change", applyTheme);

    return () => {
      window.clearTimeout(syncThemeMode);
      mediaQuery.removeEventListener("change", applyTheme);
    };
  }, []);

  useEffect(() => {
    if (!themeMenuOpen) return;

    function handleThemeMenuKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setThemeMenuOpen(false);
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        themeMenuRef.current &&
        !themeMenuRef.current.contains(event.target as Node)
      ) {
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

  function openSearch() {
    if (pathname.endsWith("/search")) {
      setSearchQuery(new URLSearchParams(window.location.search).get("q") ?? "");
    }
    setMenuOpen(false);
    setSearchOpen(true);
  }

  useEffect(() => {
    if (!searchOpen) return;

    searchInputRef.current?.focus();
    const searchButton = searchButtonRef.current;

    function handleSearchKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setSearchOpen(false);
    }

    document.addEventListener("keydown", handleSearchKeyDown);
    return () => {
      document.removeEventListener("keydown", handleSearchKeyDown);
      searchButton?.focus();
    };
  }, [searchOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const menuButton = menuButtonRef.current;
    document.body.style.overflow = "hidden";
    drawerRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }

      if (event.key !== "Tab" || !drawerRef.current) return;
      const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      menuButton?.focus();
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 shadow-[0_8px_30px_rgba(9,42,50,0.04)] lg:backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:gap-5 lg:px-8">
        <Link
          href={`/${locale}`}
          onClick={() => setSearchOpen(false)}
          className="group flex min-w-0 shrink-0 items-center gap-2.5 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
          aria-label="KPESH home"
        >
          {logo?.url ? (
            <Image
              src={logo.url}
              alt={logo.alt?.[locale] || "KPESH"}
              width={logo.width || 44}
              height={logo.height || 44}
              className="h-10 w-10 shrink-0 rounded-full object-contain transition-transform duration-300 group-hover:scale-105 sm:h-11 sm:w-11"
            />
          ) : (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-navy via-navy-2 to-[#0b302f] text-lg font-bold text-brand shadow-sm transition-transform duration-300 group-hover:scale-105 sm:h-11 sm:w-11">
              K
            </span>
          )}
          <span className="leading-tight">
            <span className="block text-lg font-bold tracking-wide text-navy sm:text-xl">
              {shortName}
            </span>
            <span className="hidden text-[10px] uppercase tracking-[0.22em] text-slate-500 sm:block">
              Power Engineering
            </span>
          </span>
        </Link>

        <nav
          aria-label={isBn ? "প্রধান নেভিগেশন" : "Main navigation"}
          className="hidden items-center gap-0.5 rounded-full border border-slate-200/70 bg-transparent p-1 text-[13px] font-medium text-slate-600 xl:flex"
        >
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== `/${locale}` && pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSearchOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={`relative whitespace-nowrap rounded-full bg-transparent px-3 py-2 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                  isActive
                    ? "font-semibold text-navy after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-brand"
                    : "hover:bg-transparent hover:text-navy"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            ref={searchButtonRef}
            type="button"
            onClick={() => (searchOpen ? setSearchOpen(false) : openSearch())}
            aria-label={isBn ? "সার্চ করুন" : "Search"}
            aria-expanded={searchOpen}
            aria-controls="public-header-search"
            className="flex h-10 cursor-pointer items-center gap-2 rounded-full border border-slate-200/80 bg-white px-3 py-2 text-sm font-semibold text-navy shadow-sm transition-all duration-200 hover:border-brand/70 hover:bg-brand/5 hover:shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:px-4"
          >
            <span className="hidden sm:inline">{isBn ? "সার্চ" : "Search"}</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <circle cx="10.8" cy="10.8" r="6.8" />
              <path strokeLinecap="round" d="m16 16 4.5 4.5" />
            </svg>
          </button>
          <Link
            href={`/${alternateLocale}${localizedPath}`}
            onClick={() => setSearchOpen(false)}
            className="flex h-10 items-center rounded-full border border-slate-200/80 bg-white px-3 py-2 text-xs font-semibold tracking-widest text-navy shadow-sm transition-all duration-200 hover:border-brand/70 hover:bg-brand/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {isBn ? "EN" : "BN"}
          </Link>
          <div ref={themeMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setThemeMenuOpen((open) => !open)}
              aria-haspopup="menu"
              aria-expanded={themeMenuOpen}
              aria-label={isBn ? "থিম নির্বাচন করুন" : "Choose theme"}
              className="flex h-10 cursor-pointer items-center gap-1.5 rounded-full border border-slate-200/80 bg-white px-3 text-xs font-semibold text-navy shadow-sm transition-all duration-200 hover:border-brand/70 hover:bg-brand/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:px-3.5"
            >
              <span aria-hidden="true" className="text-sm">
                {themeMode === "dark" ? "☀" : themeMode === "light" ? "☼" : "◐"}
              </span>
              <span className="hidden sm:inline">
                {themeMode === "system"
                  ? isBn
                    ? "সিস্টেম"
                    : "System"
                  : themeMode === "dark"
                    ? isBn
                      ? "ডার্ক"
                      : "Dark"
                    : isBn
                      ? "লাইট"
                      : "Light"}
              </span>
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className={`h-3.5 w-3.5 transition-transform duration-200 ${themeMenuOpen ? "rotate-180" : ""}`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m3.5 6 4.5 4 4.5-4" />
              </svg>
            </button>
            {themeMenuOpen ? (
              <div
                role="menu"
                aria-label={isBn ? "থিম অপশন" : "Theme options"}
                className="absolute right-0 top-[calc(100%+0.6rem)] z-[70] w-36 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 p-1.5 text-sm text-navy shadow-xl shadow-navy/15 backdrop-blur-xl"
              >
                {(["system", "light", "dark"] as ThemeMode[]).map((mode) => {
                  const label =
                    mode === "system"
                      ? isBn
                        ? "সিস্টেম"
                        : "System"
                      : mode === "dark"
                        ? isBn
                          ? "ডার্ক"
                          : "Dark"
                        : isBn
                          ? "লাইট"
                          : "Light";
                  return (
                    <button
                      key={mode}
                      type="button"
                      role="menuitemradio"
                      aria-checked={themeMode === mode}
                      onClick={() => {
                        const isDark =
                          mode === "dark" ||
                          (mode === "system" &&
                            window.matchMedia("(prefers-color-scheme: dark)").matches);
                        document.documentElement.classList.toggle("dark", isDark);
                        document.documentElement.dataset.theme = mode;
                        window.localStorage.setItem("kpesh-theme", mode);
                        document.documentElement.style.colorScheme = isDark ? "dark" : "light";
                        setThemeMode(mode);
                        setThemeMenuOpen(false);
                      }}
                      className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-brand ${
                        themeMode === mode
                          ? "bg-brand/15 font-semibold text-navy"
                          : "hover:bg-slate-100"
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
            ref={menuButtonRef}
            type="button"
            onClick={() => {
              setSearchOpen(false);
              setMenuOpen(true);
            }}
            aria-label={isBn ? "মেনু খুলুন" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-public-navigation"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-navy transition hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand xl:hidden"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>

      <div
        id="public-header-search"
        aria-hidden={!searchOpen}
        inert={!searchOpen}
        className={`overflow-hidden border-t border-slate-200/80 transition-[max-height,opacity] duration-300 motion-reduce:transition-none ${
          searchOpen ? "max-h-24 opacity-100" : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <form
          action={`/${locale}/search`}
          method="get"
          role="search"
          className="mx-auto flex max-w-3xl items-center gap-3 px-5 py-3.5 sm:px-7 lg:px-8"
        >
          <label className="sr-only" htmlFor="public-search-query">
            {isBn ? "সেবা, পণ্য, প্রকল্প বা নিবন্ধ খুঁজুন" : "Search services, products, projects, or articles"}
          </label>
          <div className="relative min-w-0 flex-1">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
            >
              <circle cx="10.8" cy="10.8" r="6.8" />
              <path strokeLinecap="round" d="m16 16 4.5 4.5" />
            </svg>
            <input
              ref={searchInputRef}
              id="public-search-query"
              name="q"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.nativeEvent.isComposing) {
                  event.preventDefault();
                  if (searchQuery.trim().length >= 2) {
                    event.currentTarget.form?.requestSubmit();
                  }
                }
              }}
              minLength={2}
              maxLength={100}
              placeholder={
                isBn
                  ? "সেবা, পণ্য, প্রকল্প বা নিবন্ধ খুঁজুন..."
                  : "Search services, products, projects, or articles..."
              }
              className="w-full rounded-xl border border-slate-200/80 bg-white/70 py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 placeholder:text-slate-400 dark:border-white/15 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-400"
            />
          </div>
          {searchQuery ? (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                searchInputRef.current?.focus();
              }}
              aria-label={isBn ? "সার্চ মুছুন" : "Clear search"}
              className="rounded-full px-2 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-navy focus-visible:outline-2 focus-visible:outline-brand"
            >
              {isBn ? "মুছুন" : "Clear"}
            </button>
          ) : null}
          <button
            type="submit"
            disabled={searchQuery.trim().length < 2}
            className="cursor-pointer rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-2 disabled:cursor-not-allowed disabled:opacity-45 dark:bg-brand dark:text-navy dark:hover:bg-[#b9ed73]"
          >
            {isBn ? "খুঁজুন" : "Search"}
          </button>
          <button
            type="button"
            onClick={() => setSearchOpen(false)}
            aria-label={isBn ? "সার্চ বন্ধ করুন" : "Close search"}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-slate-500 transition-all duration-200 hover:bg-brand/15 hover:text-brand-dark hover:rotate-90 focus-visible:outline-2 focus-visible:outline-brand"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </form>
      </div>

      <div
        className={`fixed inset-0 z-[60] transition-[visibility,opacity] duration-300 motion-reduce:transition-none lg:hidden ${
          menuOpen ? "visible opacity-100" : "invisible pointer-events-none opacity-0"
        }`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <button
          type="button"
          tabIndex={-1}
          aria-label={isBn ? "মেনু বন্ধ করুন" : "Close menu"}
          onClick={() => setMenuOpen(false)}
          className="absolute inset-0 z-10 h-full w-full cursor-default bg-slate-950/45"
        />
        <div
          id="mobile-public-navigation"
          ref={drawerRef}
          onMouseMove={handleNavigationPointerMove}
          onMouseLeave={(event) => {
            event.currentTarget
              .querySelectorAll<HTMLElement>(".mobile-navigation-grass-blade")
              .forEach((blade) => blade.style.setProperty("--blade-wind", "0deg"));
          }}
          role="dialog"
          aria-modal="true"
          aria-label={isBn ? "প্রধান নেভিগেশন" : "Main navigation"}
          className={`mobile-public-navigation absolute inset-y-0 left-0 isolate z-20 w-[min(84vw,22rem)] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-r border-white/10 p-5 text-white shadow-2xl transition-transform duration-300 motion-reduce:transition-none sm:p-6 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mobile-navigation-grass" aria-hidden="true">
            {Array.from({ length: 140 }, (_, index) => (
              <span
                key={index}
                className="mobile-navigation-grass-blade"
                style={
                  {
                    "--blade-index": index,
                    "--blade-bottom": `${3 + ((index * 37) % 78)}%`,
                    "--blade-height": `${54 + ((index * 29) % 72)}px`,
                    "--blade-rotation": `${-10 + ((index * 17) % 21)}deg`,
                    "--blade-delay": `${(index % 11) * -0.27}s`,
                    "--blade-opacity": `${0.3 + ((index * 19) % 35) / 100}`,
                  } as CSSProperties
                }
                data-height-ratio={0.45 + ((index * 29) % 50) / 100}
              />
            ))}
          </div>
          <div className="relative z-10 flex min-h-full flex-col">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <p className="text-sm font-bold tracking-[0.18em] text-brand">KPESH</p>
                <p className="mt-1 text-xs text-white/60">
                  {isBn ? "পাওয়ার ইঞ্জিনিয়ারিং" : "Power Engineering"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-transparent text-white transition-all duration-200 hover:border-brand hover:bg-brand/15 hover:text-brand hover:rotate-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <span className="sr-only">{isBn ? "মেনু বন্ধ করুন" : "Close menu"}</span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                >
                  <path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            <nav
              className="relative z-10 flex flex-col gap-1 py-3"
            >
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    setSearchOpen(false);
                    setMenuOpen(false);
                  }}
                  className="flex items-center rounded-xl bg-transparent px-3 py-3 text-base font-medium text-white/85 transition-all duration-200 hover:bg-transparent hover:pl-4 hover:text-brand focus-visible:outline-2 focus-visible:outline-brand"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto border-t border-white/10 pt-5">
              <button
                type="button"
                onClick={openSearch}
                className="flex cursor-pointer items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-brand"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                >
                  <circle cx="10.8" cy="10.8" r="6.8" />
                  <path strokeLinecap="round" d="m16 16 4.5 4.5" />
                </svg>
                {isBn ? "সার্চ করুন" : "Search"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
