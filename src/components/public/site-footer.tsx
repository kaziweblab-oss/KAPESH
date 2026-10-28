import Link from "next/link";
import type { Locale } from "@/lib/site-content";

export function SiteFooter({
  locale,
  logo,
  shortName = "KPESH",
}: {
  locale: Locale;
  logo?: { url?: string; alt?: { bn?: string; en?: string } } | null;
  shortName?: string;
}) {
  const isBn = locale === "bn";

  return (
    <footer className="relative isolate overflow-hidden border-t border-white/10 bg-gradient-to-br from-navy via-navy-2 to-[#0b302f] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_78%_0%,rgba(57,198,190,0.12),transparent_38%),radial-gradient(ellipse_at_12%_100%,rgba(155,214,74,0.08),transparent_36%)]"
      />
      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-6 pt-10 sm:px-6 sm:pb-7 sm:pt-12 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-[1fr_1.4fr] sm:gap-10 lg:grid-cols-[1fr_2fr]">
          <div className="max-w-sm">
            <Link
              href={`/${locale}`}
              className="inline-flex min-h-11 items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
              aria-label={isBn ? "KPESH হোম" : "KPESH home"}
            >
              <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/10 text-lg font-bold text-brand">
                {logo?.url ? <img src={logo.url} alt={logo.alt?.[locale] || shortName} className="h-full w-full rounded-full object-contain p-1" /> : "K"}
              </span>
              <span className="text-lg font-bold tracking-wide">{shortName}</span>
            </Link>
            <p className="mt-4 text-sm leading-6 text-white/65">
              {isBn
                ? "নির্ভরযোগ্য বিদ্যুৎ ও এনার্জি সমাধানে আপনার পাশে।"
                : "Reliable power and energy solutions, built around you."}
            </p>
          </div>

          <nav aria-label={isBn ? "ফুটার নেভিগেশন" : "Footer navigation"}>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              {isBn ? "এক্সপ্লোর করুন" : "Explore"}
            </p>
            <ul className="grid grid-cols-2 gap-1 sm:grid-cols-3">
              {[
                [isBn ? "সেবা" : "Services", "services"],
                [isBn ? "পণ্য" : "Products", "products"],
                [isBn ? "প্রকল্প" : "Projects", "projects"],
                [isBn ? "ব্লগ" : "Blog", "blog"],
                [isBn ? "আমাদের সম্পর্কে" : "About", "about"],
                [isBn ? "যোগাযোগ" : "Contact", "contact"],
              ].map(([label, path]) => (
                <li key={path}>
                  <Link
                    href={`/${locale}/${path}`}
                    className="inline-flex min-h-11 items-center rounded-lg px-2 text-sm text-white/75 transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-brand"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-5 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} KPESH.{" "}
            {isBn ? "সর্বস্বত্ব সংরক্ষিত।" : "All rights reserved."}
          </p>
          <nav
            aria-label={isBn ? "আইনি তথ্য" : "Legal"}
            className="flex flex-wrap gap-x-5 gap-y-1"
          >
            <Link
              href={`/${locale}/privacy`}
              className="inline-flex min-h-10 items-center transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-brand"
            >
              {isBn ? "গোপনীয়তা" : "Privacy"}
            </Link>
            <Link
              href={`/${locale}/terms`}
              className="inline-flex min-h-10 items-center transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-brand"
            >
              {isBn ? "শর্তাবলি" : "Terms"}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
