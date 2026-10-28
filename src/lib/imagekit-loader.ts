import type { ImageLoaderProps } from "next/image";

export default function imagekitLoader({ src, width, quality }: ImageLoaderProps): string {
  const endpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
  const normalizedEndpoint = endpoint?.replace(/\/+$/, "");
  if (!normalizedEndpoint || !src.startsWith(`${normalizedEndpoint}/`)) return src;

  const url = new URL(src);
  const transform = `w-${width},q-${quality ?? 75}`;
  const existingTransform = url.searchParams.get("tr");
  url.searchParams.set("tr", existingTransform ? `${existingTransform},${transform}` : transform);
  return url.toString();
}
