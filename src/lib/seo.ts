import type { Metadata } from "next";
import type { Locale } from "@/lib/site-content";

type PageMetadataInput = {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  image?: string;
};

export function createPageMetadata({
  locale,
  path,
  title,
  description,
  image,
}: PageMetadataInput): Metadata {
  const canonicalPath = `/${locale}${path}`;
  const languages = {
    "bn-BD": `/bn${path}`,
    "en-US": `/en${path}`,
    "x-default": `/bn${path}`,
  };
  const images = image ? [{ url: image }] : undefined;

  return {
    title,
    description,
    alternates: { canonical: canonicalPath, languages },
    openGraph: {
      type: "website",
      locale: locale === "bn" ? "bn_BD" : "en_US",
      url: canonicalPath,
      title,
      description,
      images,
    },
    twitter: { card: image ? "summary_large_image" : "summary", title, description, images },
  };
}

export function jsonLd(value: Record<string, unknown>): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
