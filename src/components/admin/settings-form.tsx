"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MediaPicker, uploadImageFile } from "@/components/admin/media-picker";
import { adminTranslate, type AdminLocale } from "@/lib/admin-i18n-core";

type SettingsMediaRef = {
  url: string;
  publicId: string;
  alt: { bn: string; en: string };
  width: number;
  height: number;
};

type BackgroundVideoRef = {
  url: string;
  publicId: string;
  mimeType: "" | "video/mp4" | "video/webm";
};

type SettingsFormValues = {
  siteName: { bn: string; en: string };
  shortName: string;
  tagline: { bn: string; en: string };
  logo: SettingsMediaRef;
  backgroundVideo: BackgroundVideoRef;
  faviconUrl: string;
  theme: { navy: string; navy2: string; brand: string; brandDark: string };
  contact: {
    phone: string;
    phoneAlt: string;
    email: string;
    whatsapp: string;
    address: { bn: string; en: string };
    mapUrl: string;
  };
  social: { facebook: string; youtube: string; instagram: string; linkedin: string };
  seo: {
    title: { bn: string; en: string };
    description: { bn: string; en: string };
    keywords: string[];
    ogImageUrl: string;
  };
};

const emptySettings: SettingsFormValues = {
  siteName: { bn: "", en: "" },
  shortName: "KPESH",
  tagline: { bn: "", en: "" },
  logo: { url: "", publicId: "", alt: { bn: "", en: "" }, width: 0, height: 0 },
  backgroundVideo: { url: "", publicId: "", mimeType: "" },
  faviconUrl: "",
  theme: { navy: "#092a32", navy2: "#0c3940", brand: "#9bd64a", brandDark: "#4d8d2a" },
  contact: {
    phone: "",
    phoneAlt: "",
    email: "",
    whatsapp: "",
    address: { bn: "", en: "" },
    mapUrl: "",
  },
  social: { facebook: "", youtube: "", instagram: "", linkedin: "" },
  seo: {
    title: { bn: "", en: "" },
    description: { bn: "", en: "" },
    keywords: [],
    ogImageUrl: "",
  },
};

function TextField({
  label,
  value,
  onChange,
  locale,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  locale: AdminLocale;
  type?: string;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {adminTranslate(locale, label)}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
      />
    </label>
  );
}

function LocalizedFields({
  label,
  value,
  onChange,
  multiline = false,
  locale,
}: {
  label: string;
  value: { bn: string; en: string };
  onChange: (locale: "bn" | "en", value: string) => void;
  multiline?: boolean;
  locale: AdminLocale;
}) {
  return (
    <fieldset className="grid gap-4 rounded-2xl border border-slate-200 p-4 sm:grid-cols-2">
      <legend className="px-2 text-sm font-semibold text-slate-700">{adminTranslate(locale, label)}</legend>
      {(["bn", "en"] as const).map((locale) => (
        <label key={locale} className="block text-sm font-medium text-slate-700">
          {locale === "bn" ? "বাংলা" : "English"}
          {multiline ? (
            <textarea
              value={value[locale]}
              onChange={(event) => onChange(locale, event.target.value)}
              rows={3}
              className="mt-1.5 h-32 min-h-32 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand"
            />
          ) : (
            <input
              value={value[locale]}
              onChange={(event) => onChange(locale, event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand"
            />
          )}
        </label>
      ))}
    </fieldset>
  );
}

function SectionActions({
  locale,
  dirty,
  pending,
  videoPending,
  onCancel,
}: {
  locale: AdminLocale;
  dirty: boolean;
  pending: boolean;
  videoPending: boolean;
  onCancel: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4">
      <button
        type="submit"
        disabled={!dirty || pending || videoPending}
        className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? adminTranslate(locale, "Saving...") : locale === "bn" ? "সংরক্ষণ করুন" : "Save"}
      </button>
      <button
        type="button"
        disabled={!dirty || pending || videoPending}
        onClick={onCancel}
        className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {locale === "bn" ? "বাতিল করুন" : "Cancel"}
      </button>
    </div>
  );
}

export function SettingsForm({ initial, locale }: { initial: Partial<SettingsFormValues> | null; locale: AdminLocale }) {
  const router = useRouter();
  const [pendingLogoFile, setPendingLogoFile] = useState<File | null>(null);
  const [values, setValues] = useState<SettingsFormValues>({
    ...emptySettings,
    ...initial,
    backgroundVideo: {
      ...emptySettings.backgroundVideo,
      ...initial?.backgroundVideo,
    },
    siteName: { ...emptySettings.siteName, ...initial?.siteName },
    tagline: { ...emptySettings.tagline, ...initial?.tagline },
    theme: { ...emptySettings.theme, ...initial?.theme },
    contact: {
      ...emptySettings.contact,
      ...initial?.contact,
      address: { ...emptySettings.contact.address, ...initial?.contact?.address },
    },
    social: { ...emptySettings.social, ...initial?.social },
    seo: {
      ...emptySettings.seo,
      ...initial?.seo,
      title: { ...emptySettings.seo.title, ...initial?.seo?.title },
      description: { ...emptySettings.seo.description, ...initial?.seo?.description },
    },
  });
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const [pending, setPending] = useState(false);
  const [videoPending, setVideoPending] = useState(false);
  const [savedValues, setSavedValues] = useState(values);
  const [dirty, setDirty] = useState(false);

  function cancelChanges() {
    setValues(savedValues);
    setPendingLogoFile(null);
    setDirty(false);
    setError("");
    setSaved("");
  }

  async function uploadBackgroundVideo(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;

    setError("");
    setSaved("");
    let mimeType: BackgroundVideoRef["mimeType"];
    if (file.type === "video/mp4") {
      mimeType = "video/mp4";
    } else if (file.type === "video/webm") {
      mimeType = "video/webm";
    } else {
      setError("Choose an MP4 or WebM video.");
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setError("Background videos must be 25 MB or smaller.");
      return;
    }

    setVideoPending(true);
    try {
      const authResponse = await fetch("/api/admin/media/auth", { cache: "no-store" });
      const authResult = (await authResponse.json()) as {
        token?: string;
        expire?: number;
        signature?: string;
        publicKey?: string;
        error?: string;
      };
      if (
        !authResponse.ok ||
        !authResult.token ||
        !authResult.expire ||
        !authResult.signature ||
        !authResult.publicKey
      ) {
        throw new Error(authResult.error ?? "Could not authorize the video upload.");
      }

      const uploadData = new FormData();
      uploadData.set("file", file);
      uploadData.set("fileName", file.name);
      uploadData.set("folder", "/kpesh/backgrounds");
      uploadData.set("token", authResult.token);
      uploadData.set("expire", String(authResult.expire));
      uploadData.set("signature", authResult.signature);
      uploadData.set("publicKey", authResult.publicKey);
      uploadData.set("useUniqueFileName", "true");

      const uploadResponse = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
        method: "POST",
        body: uploadData,
      });
      const uploadResult = (await uploadResponse.json()) as {
        fileId?: string;
        url?: string;
        message?: string;
      };
      if (!uploadResponse.ok || !uploadResult.fileId || !uploadResult.url) {
        throw new Error(uploadResult.message ?? "ImageKit video upload failed.");
      }

      setValues((current) => ({
        ...current,
        backgroundVideo: {
          url: uploadResult.url!,
          publicId: uploadResult.fileId!,
          mimeType,
        },
      }));
      setDirty(true);
      setSaved("Video uploaded. Save site settings to publish it.");
    } catch (uploadError) {
      console.error("Background video upload failed.", uploadError);
      setError(
        uploadError instanceof Error ? uploadError.message : "The background video could not be uploaded.",
      );
    } finally {
      setVideoPending(false);
    }
  }

  function updateLocalized(
    section: "siteName" | "tagline" | "address" | "seoTitle" | "seoDescription",
    locale: "bn" | "en",
    value: string,
  ) {
    setValues((current) => {
      if (section === "siteName" || section === "tagline") {
        return { ...current, [section]: { ...current[section], [locale]: value } };
      }
      if (section === "address") {
        return {
          ...current,
          contact: { ...current.contact, address: { ...current.contact.address, [locale]: value } },
        };
      }
      if (section === "seoTitle") {
        return {
          ...current,
          seo: { ...current.seo, title: { ...current.seo.title, [locale]: value } },
        };
      }
      return {
        ...current,
        seo: { ...current.seo, description: { ...current.seo.description, [locale]: value } },
      };
    });
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    setSaved("");
    try {
      const formData = new FormData(event.currentTarget);
      const logo = formData.get("logo");
      const savedLogo = pendingLogoFile ? await uploadImageFile(pendingLogoFile) : values.logo;
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          logo: pendingLogoFile
            ? savedLogo
            : typeof logo === "string" && JSON.parse(logo).publicId
              ? JSON.parse(logo)
              : values.logo,
          seo: {
            ...values.seo,
            keywords: values.seo.keywords
              .join(",")
              .split(",")
              .map((keyword) => keyword.trim())
              .filter(Boolean),
          },
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(result.error ?? "Unable to save site settings.");
        return;
      }
      if (pendingLogoFile) {
        setValues((currentValues) => ({ ...currentValues, logo: savedLogo }));
        setPendingLogoFile(null);
      }
      const nextValues = pendingLogoFile ? { ...values, logo: savedLogo } : values;
      setSavedValues(nextValues);
      setDirty(false);
      setSaved("Site settings saved.");
      router.refresh();
    } catch (requestError) {
      console.error("Site settings request failed.", requestError);
      setError("Could not reach the server. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={save}
      onChange={() => {
        setDirty(true);
        setSaved("");
      }}
      className="space-y-6"
    >
      <section className="space-y-5 rounded-[1.5rem] border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">{locale === "bn" ? "সাইট পরিচিতি" : "Site identity"}</h2>
        <LocalizedFields
          label="Site name"
          value={values.siteName}
          locale={locale}
          onChange={(locale, value) => updateLocalized("siteName", locale, value)}
        />
        <TextField
          label="Short name"
          value={values.shortName}
          locale={locale}
          onChange={(shortName) => setValues((v) => ({ ...v, shortName }))}
        />
        <LocalizedFields
          label="Tagline"
          value={values.tagline}
          locale={locale}
          onChange={(locale, value) => updateLocalized("tagline", locale, value)}
        />
        <MediaPicker
          name="logo"
          label={adminTranslate(locale, "Site logo")}
          value={values.logo}
          locale={locale}
          uploadOnly
          onPendingFile={setPendingLogoFile}
        />
        <SectionActions locale={locale} dirty={dirty} pending={pending} videoPending={videoPending} onCancel={cancelChanges} />
      </section>
      <section className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-white p-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{adminTranslate(locale, "Animated background video")}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Optional MP4 or WebM, up to 25 MB. This video appears behind the homepage hero and
            admin login; the animated gradient remains as a fallback.
          </p>
        </div>
        {values.backgroundVideo.url ? (
          <div className="space-y-3">
            <video
              key={values.backgroundVideo.url}
              src={values.backgroundVideo.url}
              controls
              muted
              loop
              playsInline
              preload="metadata"
              className="max-h-64 w-full rounded-2xl bg-navy object-cover"
            />
          </div>
        ) : (
          <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            No custom video selected. The animated gradient background will be used.
          </p>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-navy/20 bg-navy px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:border-brand hover:bg-navy-2 hover:shadow-md">
            <span className="rounded-lg bg-white/10 p-1.5" aria-hidden="true">
              <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
                <path d="M10 13V3m0 0L6.5 6.5M10 3l3.5 3.5M4 11.5v3A1.5 1.5 0 0 0 5.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            {videoPending
              ? adminTranslate(locale, "Uploading video...")
              : values.backgroundVideo.url
                ? adminTranslate(locale, "Replace video")
                : adminTranslate(locale, "Upload video")}
            <input
              type="file"
              accept="video/mp4,video/webm"
              disabled={videoPending}
              onChange={(event) => void uploadBackgroundVideo(event)}
              className="sr-only"
            />
          </label>
          {values.backgroundVideo.url ? (
            <button
              type="button"
              disabled={videoPending}
              onClick={() =>
                {
                  setSaved("");
                  setError("");
                  setDirty(true);
                  setValues((current) => ({
                    ...current,
                    backgroundVideo: { ...emptySettings.backgroundVideo },
                  }));
                }
              }
              className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-red-300 hover:text-red-700 disabled:opacity-60"
            >
              {adminTranslate(locale, "Remove video")}
            </button>
          ) : null}
          <span className="text-xs text-slate-500">Muted autoplay · MP4/WebM · 25 MB max</span>
        </div>
      </section>
      <SectionActions locale={locale} dirty={dirty} pending={pending} videoPending={videoPending} onCancel={cancelChanges} />
      <TextField
        label="Favicon URL"
        value={values.faviconUrl}
        locale={locale}
        onChange={(faviconUrl) => setValues((v) => ({ ...v, faviconUrl }))}
      />

      <section className="grid gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-5 sm:grid-cols-2">
        <h2 className="text-lg font-semibold text-slate-900 sm:col-span-2">{adminTranslate(locale, "Brand colors")}</h2>
        {(["navy", "navy2", "brand", "brandDark"] as const).map((key) => (
          <TextField
            key={key}
            label={key}
            value={values.theme[key]}
            locale={locale}
            onChange={(value) => setValues((v) => ({ ...v, theme: { ...v.theme, [key]: value } }))}
          />
        ))}
      </section>
      <SectionActions locale={locale} dirty={dirty} pending={pending} videoPending={videoPending} onCancel={cancelChanges} />

      <section className="grid gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-5 sm:grid-cols-2">
        <h2 className="text-lg font-semibold text-slate-900 sm:col-span-2">{adminTranslate(locale, "Contact")}</h2>
        {(["phone", "phoneAlt", "email", "whatsapp", "mapUrl"] as const).map((key) => (
          <TextField
            key={key}
            label={key}
            value={values.contact[key]}
            locale={locale}
            onChange={(value) =>
              setValues((v) => ({ ...v, contact: { ...v.contact, [key]: value } }))
            }
            type={key === "email" ? "email" : "text"}
          />
        ))}
        <div className="sm:col-span-2">
          <LocalizedFields
            label="Address"
            value={values.contact.address}
            locale={locale}
            onChange={(locale, value) => updateLocalized("address", locale, value)}
          />
        </div>
      </section>
      <SectionActions locale={locale} dirty={dirty} pending={pending} videoPending={videoPending} onCancel={cancelChanges} />

      <section className="grid gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-5 sm:grid-cols-2">
        <h2 className="text-lg font-semibold text-slate-900 sm:col-span-2">{adminTranslate(locale, "Social links")}</h2>
        {(["facebook", "youtube", "instagram", "linkedin"] as const).map((key) => (
          <TextField
            key={key}
            label={key}
            value={values.social[key]}
            locale={locale}
            onChange={(value) =>
              setValues((v) => ({ ...v, social: { ...v.social, [key]: value } }))
            }
          />
        ))}
      </section>
      <SectionActions locale={locale} dirty={dirty} pending={pending} videoPending={videoPending} onCancel={cancelChanges} />

      <section className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900">{adminTranslate(locale, "SEO")}</h2>
        <LocalizedFields
          label="Meta title"
          value={values.seo.title}
          locale={locale}
          onChange={(locale, value) => updateLocalized("seoTitle", locale, value)}
        />
        <LocalizedFields
          label="Meta description"
          value={values.seo.description}
          locale={locale}
          onChange={(locale, value) => updateLocalized("seoDescription", locale, value)}
          multiline
        />
        <TextField
          label="Keywords (comma separated)"
          value={values.seo.keywords.join(", ")}
          locale={locale}
          onChange={(value) =>
            setValues((v) => ({ ...v, seo: { ...v.seo, keywords: value.split(",") } }))
          }
        />
        <TextField
          label="Open Graph image URL"
          value={values.seo.ogImageUrl}
          locale={locale}
          onChange={(value) => setValues((v) => ({ ...v, seo: { ...v.seo, ogImageUrl: value } }))}
        />
        <SectionActions locale={locale} dirty={dirty} pending={pending} videoPending={videoPending} onCancel={cancelChanges} />
      </section>

      {error ? (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      {saved ? (
        <p role="status" className="rounded-xl bg-brand/10 px-4 py-3 text-sm text-navy">
          {saved}
        </p>
      ) : null}
    </form>
  );
}
