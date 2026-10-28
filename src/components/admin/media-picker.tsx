"use client";

import { useEffect, useState } from "react";
import { adminTranslate, type AdminLocale } from "@/lib/admin-i18n-core";

type MediaOption = {
  url: string;
  publicId: string;
  alt: { bn: string; en: string };
  width: number;
  height: number;
};

type MediaRef = MediaOption;

export async function uploadImageFile(file: File): Promise<MediaOption> {
  const authResponse = await fetch("/api/admin/media/auth", { cache: "no-store" });
  const auth = (await authResponse.json()) as {
    token?: string; expire?: number; signature?: string; publicKey?: string; error?: string;
  };
  if (!authResponse.ok || !auth.token || !auth.expire || !auth.signature || !auth.publicKey) {
    throw new Error(auth.error ?? "Could not authorize the image upload.");
  }
  const data = new FormData();
  data.set("file", file);
  data.set("fileName", file.name);
  data.set("folder", "/kpesh");
  data.set("token", auth.token);
  data.set("expire", String(auth.expire));
  data.set("signature", auth.signature);
  data.set("publicKey", auth.publicKey);
  data.set("useUniqueFileName", "true");
  const uploadResponse = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    body: data,
  });
  const uploaded = (await uploadResponse.json()) as {
    fileId?: string; url?: string; width?: number; height?: number; size?: number; message?: string;
  };
  if (!uploadResponse.ok || !uploaded.fileId || !uploaded.url) {
    throw new Error(uploaded.message ?? "ImageKit upload failed.");
  }
  const metadataResponse = await fetch("/api/admin/media", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileId: uploaded.fileId,
      url: uploaded.url,
      width: uploaded.width ?? 0,
      height: uploaded.height ?? 0,
      size: uploaded.size ?? file.size,
      mimeType: file.type,
      alt: { bn: "", en: file.name },
    }),
  });
  const metadata = (await metadataResponse.json()) as { media?: MediaOption; error?: string };
  if (!metadataResponse.ok || !metadata.media) {
    throw new Error(metadata.error ?? "Could not save the image to the media library.");
  }
  return metadata.media;
}

export function MediaPicker({
  name,
  label,
  value,
  multiple = false,
  locale = "en",
  uploadOnly = false,
  onPendingFile,
}: {
  name: string;
  label: string;
  value: unknown;
  multiple?: boolean;
  locale?: AdminLocale;
  uploadOnly?: boolean;
  onPendingFile?: (file: File | null) => void;
}) {
  const [media, setMedia] = useState<MediaOption[]>([]);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (uploadOnly) return;
    let active = true;
    fetch("/api/admin/media", { cache: "no-store" })
      .then(async (response) => {
        const result = (await response.json()) as { media?: MediaOption[]; error?: string };
        if (!response.ok) throw new Error(result.error ?? "Media library is unavailable.");
        if (active) setMedia(result.media ?? []);
      })
      .catch((requestError: unknown) => {
        if (active)
          setError(
            requestError instanceof Error ? requestError.message : "Media library is unavailable.",
          );
      });
    return () => {
      active = false;
    };
  }, [uploadOnly]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const current = multiple
    ? Array.isArray(value)
      ? (value as MediaRef[])
      : []
    : value && typeof value === "object"
      ? [value as MediaRef]
      : [];
  const selectedIds = current.map((item) => item.publicId).filter(Boolean);
  const [chosenIds, setChosenIds] = useState(selectedIds);
  const selected = media.filter((item) => chosenIds.includes(item.publicId));

  function serializeSelection(event: React.ChangeEvent<HTMLSelectElement>) {
    const ids = multiple
      ? Array.from(event.currentTarget.selectedOptions, (option) => option.value)
      : event.currentTarget.value
        ? [event.currentTarget.value]
        : [];
    setChosenIds(ids);
    const chosen = media.filter((item) => ids.includes(item.publicId));
    const refs = chosen.map((item) => ({
      url: item.url,
      publicId: item.publicId,
      alt: item.alt,
      width: item.width,
      height: item.height,
    }));
    const output = multiple
      ? refs
      : (refs[0] ?? { url: "", publicId: "", alt: { bn: "", en: "" }, width: 0, height: 0 });
    const hidden = event.currentTarget.form?.elements.namedItem(name);
    if (hidden instanceof HTMLInputElement) hidden.value = JSON.stringify(output);
  }

  async function uploadImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"].includes(file.type)) {
      setError("Use a JPG, PNG, WebP, AVIF, or GIF image.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Images must be 8 MB or smaller.");
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    setPreviewUrl((currentUrl) => {
      if (currentUrl) URL.revokeObjectURL(currentUrl);
      return URL.createObjectURL(file);
    });
    setError("");
    if (uploadOnly) {
      onPendingFile?.(file);
      return;
    }

    setUploading(true);
    try {
      const metadata = await uploadImageFile(file);
      setMedia((currentMedia) => [metadata, ...currentMedia]);
      setChosenIds((currentIds) => (multiple ? [...currentIds, metadata.publicId] : [metadata.publicId]));
      const hidden = document.querySelector(`input[type="hidden"][name="${name}"]`);
      if (hidden instanceof HTMLInputElement) {
        hidden.value = JSON.stringify(metadata);
      }
    } catch (uploadError) {
      console.error("Media picker upload failed.", uploadError);
      setError(uploadError instanceof Error ? uploadError.message : "The image could not be uploaded.");
    } finally {
      setUploading(false);
    }
  }

  const currentSerialized = JSON.stringify(
    multiple
      ? current
      : (current[0] ?? { url: "", publicId: "", alt: { bn: "", en: "" }, width: 0, height: 0 }),
  );

  return (
    <div className="block sm:col-span-2">
      <label className="text-sm font-medium text-slate-700" htmlFor={`${name}-picker`}>
        {label} {multiple ? "(Ctrl/Cmd-click to select multiple)" : ""}
      </label>
      <input type="hidden" name={name} defaultValue={currentSerialized} />
      {uploadOnly ? null : (
        <select
          id={`${name}-picker`}
          name={`${name}__picker`}
          multiple={multiple}
          value={multiple ? chosenIds : (chosenIds[0] ?? "")}
          onChange={serializeSelection}
          size={multiple ? 5 : undefined}
          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
        >
          {!multiple ? <option value="">{locale === "bn" ? "কোনো ছবি নির্বাচিত নেই" : "No image selected"}</option> : null}
          {media.map((item) => (
            <option key={item.publicId} value={item.publicId}>
              {item.alt?.en || item.alt?.bn || item.publicId}
            </option>
          ))}
        </select>
      )}
      {!multiple ? (
        <label
          className="mt-2 flex w-full cursor-pointer items-center gap-2 rounded-2xl border border-brand/40 bg-brand/10 px-4 py-2 text-xs font-semibold text-brand-dark transition hover:border-brand hover:bg-brand/20"
          style={{ justifyContent: "flex-end" }}
        >
          <span className="rounded-lg bg-brand/20 p-1.5" aria-hidden="true">
            <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
              <path d="M10 13V3m0 0L6.5 6.5M10 3l3.5 3.5M4 11.5v3A1.5 1.5 0 0 0 5.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          {uploading ? adminTranslate(locale, "Uploading") : uploadOnly ? (locale === "bn" ? "লোগো আপলোড করুন" : "Upload logo") : adminTranslate(locale, "Upload new image")}
          <input type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" onChange={(event) => void uploadImage(event)} disabled={uploading} className="sr-only" />
        </label>
      ) : null}
      {previewUrl || (uploadOnly && current[0]?.url) ? (
        <img
          src={previewUrl || current[0].url}
          alt={label}
          className="mt-3 h-24 w-24 rounded-full border border-slate-200 object-contain p-2"
        />
      ) : null}
      {selected.map((item) => (
        <div key={item.publicId} className="mt-3 space-y-2">
          {!previewUrl ? (
            <img
              src={item.url}
              alt={item.alt?.en || item.alt?.bn || label}
              className="h-24 w-24 rounded-full border border-slate-200 object-contain p-2"
            />
          ) : null}
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="block truncate text-xs text-brand-dark underline"
          >
            {item.url}
          </a>
        </div>
      ))}
      {error ? (
        <p className="mt-2 text-xs text-amber-700">
          {error} Upload/select media from the Media page if your role allows it.
        </p>
      ) : null}
      {!uploadOnly && !error && media.length === 0 ? (
        <p className="mt-2 text-xs text-slate-500">No uploaded media available.</p>
      ) : null}
    </div>
  );
}
