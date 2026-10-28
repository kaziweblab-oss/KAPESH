"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { adminTranslate, type AdminLocale } from "@/lib/admin-i18n-core";

type MediaItem = {
  _id: string;
  url: string;
  publicId: string;
  alt: { bn: string; en: string };
  width: number;
  height: number;
  mimeType: string;
  size: number;
  createdAt: string;
};

type UploadAuth = {
  token: string;
  expire: number;
  signature: string;
  publicKey: string;
  urlEndpoint: string;
};

type ImageKitUpload = {
  fileId: string;
  url: string;
  width: number;
  height: number;
  size: number;
};

export function MediaManager({ media, locale }: { media: MediaItem[]; locale: AdminLocale }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const file = values.get("file");
    if (!(file instanceof File) || file.size === 0) {
      setError("Choose an image file to upload.");
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"].includes(file.type)) {
      setError("Use a JPG, PNG, WebP, AVIF, or GIF image.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Images must be 8 MB or smaller.");
      return;
    }

    setPending(true);
    setError("");
    setNotice("");
    try {
      const authResponse = await fetch("/api/admin/media/auth", { cache: "no-store" });
      const authResult = (await authResponse.json()) as UploadAuth & { error?: string };
      if (!authResponse.ok) throw new Error(authResult.error ?? "Could not authorize the upload.");

      const uploadData = new FormData();
      uploadData.set("file", file);
      uploadData.set("fileName", file.name);
      uploadData.set("folder", "/kpesh");
      uploadData.set("token", authResult.token);
      uploadData.set("expire", String(authResult.expire));
      uploadData.set("signature", authResult.signature);
      uploadData.set("publicKey", authResult.publicKey);
      uploadData.set("useUniqueFileName", "true");

      const imageResponse = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
        method: "POST",
        body: uploadData,
      });
      const imageResult = (await imageResponse.json()) as Partial<ImageKitUpload> & {
        message?: string;
      };
      if (!imageResponse.ok || !imageResult.fileId || !imageResult.url) {
        throw new Error(imageResult.message ?? "ImageKit upload failed.");
      }

      const metadataResponse = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileId: imageResult.fileId,
          url: imageResult.url,
          width: imageResult.width ?? 0,
          height: imageResult.height ?? 0,
          size: imageResult.size ?? file.size,
          mimeType: file.type,
          alt: { bn: values.get("altBn") ?? "", en: values.get("altEn") ?? "" },
        }),
      });
      const metadataResult = (await metadataResponse.json()) as { error?: string };
      if (!metadataResponse.ok)
        throw new Error(metadataResult.error ?? "Could not save this image to the media library.");

      setNotice("Image uploaded and added to the library.");
      form.reset();
      router.refresh();
    } catch (requestError) {
      console.error("Media upload failed.", requestError);
      setError(
        requestError instanceof Error ? requestError.message : "The image could not be uploaded.",
      );
    } finally {
      setPending(false);
    }
  }

  async function updateAlt(event: React.FormEvent<HTMLFormElement>, item: MediaItem) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPending(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/media", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item._id,
          alt: { bn: data.get("altBn"), en: data.get("altEn") },
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Could not update alt text.");
      setNotice("Alt text updated.");
      router.refresh();
    } catch (requestError) {
      console.error("Media alt-text update failed.", requestError);
      setError(requestError instanceof Error ? requestError.message : "Could not update alt text.");
    } finally {
      setPending(false);
    }
  }

  async function remove(item: MediaItem) {
    if (!window.confirm("Delete this image from ImageKit and the media library?")) return;
    setPending(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/admin/media?id=${encodeURIComponent(item._id)}`, {
        method: "DELETE",
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Could not delete the image.");
      setNotice("Image deleted.");
      router.refresh();
    } catch (requestError) {
      console.error("Media deletion failed.", requestError);
      setError(
        requestError instanceof Error ? requestError.message : "Could not delete the image.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-6">
      <header className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-dark">
          {adminTranslate(locale, "Content assets")}
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">{adminTranslate(locale, "Media library")}</h1>
        <p className="mt-2 text-slate-600">
          {adminTranslate(locale, "Upload images to ImageKit, edit bilingual alt text, or remove unused files.")}
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
        ref={formRef}
        onSubmit={(event) => void upload(event)}
        className="grid gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-6 md:grid-cols-2"
      >
        <h2 className="text-lg font-semibold text-slate-900 md:col-span-2">
          {adminTranslate(locale, "Upload image (8 MB max)")}
        </h2>
        <label className="text-sm font-medium text-slate-700 md:col-span-2">
          {adminTranslate(locale, "Image file")}
          <input
            name="file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
            required
            className="mt-1.5 block w-full rounded-xl border border-slate-200 p-2"
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          {adminTranslate(locale, "Bangla alt text")}
          <input
            name="altBn"
            maxLength={300}
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          {adminTranslate(locale, "English alt text")}
          <input
            name="altEn"
            maxLength={300}
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2"
          />
        </label>
        <button
          disabled={pending}
          className="w-fit rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Working..." : adminTranslate(locale, "Upload image")}
        </button>
      </form>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">Library ({media.length})</h2>
        <div className="grid gap-4 xl:grid-cols-2">
          {media.map((item) => (
            <article
              key={item._id}
              className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm"
            >
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="block truncate bg-slate-50 px-5 py-4 text-sm font-medium text-brand-dark underline"
              >
                Open image
              </a>
              <div className="space-y-4 p-5">
                <p className="text-xs text-slate-500">
                  {item.width} × {item.height} · {(item.size / 1024).toFixed(0)} KB ·{" "}
                  {item.mimeType}
                </p>
                <form onSubmit={(event) => void updateAlt(event, item)} className="grid gap-3">
                  <label className="text-sm font-medium text-slate-700">
                    Bangla alt text
                    <input
                      name="altBn"
                      defaultValue={item.alt?.bn ?? ""}
                      maxLength={300}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                    />
                  </label>
                  <label className="text-sm font-medium text-slate-700">
                    English alt text
                    <input
                      name="altEn"
                      defaultValue={item.alt?.en ?? ""}
                      maxLength={300}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                    />
                  </label>
                  <div className="flex flex-wrap gap-3">
                    <button
                      disabled={pending}
                      className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-60"
                    >
                      Save alt text
                    </button>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => void remove(item)}
                      className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 disabled:opacity-60"
                    >
                      Delete image
                    </button>
                  </div>
                </form>
              </div>
            </article>
          ))}
        </div>
        {media.length === 0 ? (
          <p className="rounded-2xl bg-white p-6 text-sm text-slate-500">
            The media library is empty.
          </p>
        ) : null}
      </section>
    </div>
  );
}
