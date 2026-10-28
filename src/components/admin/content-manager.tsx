"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { MediaPicker } from "@/components/admin/media-picker";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { adminTranslate, type AdminLocale } from "@/lib/admin-i18n-core";

export type AdminResource =
  | "services"
  | "projects"
  | "products"
  | "blog"
  | "categories"
  | "testimonials"
  | "faqs"
  | "navigation";

type Field = {
  name: string;
  label: string;
  type?:
    | "text"
    | "textarea"
    | "number"
    | "checkbox"
    | "select"
    | "list"
    | "media"
    | "media-list"
    | "specs"
    | "richtext";
  required?: boolean;
  options?: { label: string; value: string }[];
};

type AdminDocument = Record<string, unknown> & { _id: string };

const resourceConfig: Record<
  AdminResource,
  { title: string; description: string; primaryField: string; fields: Field[] }
> = {
  services: {
    title: "Services",
    description: "Manage bilingual service descriptions shown on the public website.",
    primaryField: "title.en",
    fields: [
      { name: "title.bn", label: "Title (Bangla)", required: true },
      { name: "title.en", label: "Title (English)", required: true },
      { name: "slug", label: "URL slug", required: true },
      { name: "excerpt.bn", label: "Short description (Bangla)", type: "textarea" },
      { name: "excerpt.en", label: "Short description (English)", type: "textarea" },
      { name: "content.bn", label: "Description (Bangla)", type: "textarea" },
      { name: "content.en", label: "Description (English)", type: "textarea" },
      { name: "cover", label: "Cover image", type: "media" },
      { name: "sortOrder", label: "Display order", type: "number" },
      { name: "featured", label: "Featured", type: "checkbox" },
      { name: "isActive", label: "Active", type: "checkbox" },
    ],
  },
  projects: {
    title: "Projects",
    description: "Add and maintain bilingual project stories and highlights.",
    primaryField: "title.en",
    fields: [
      { name: "title.bn", label: "Title (Bangla)", required: true },
      { name: "title.en", label: "Title (English)", required: true },
      { name: "slug", label: "URL slug", required: true },
      { name: "excerpt.bn", label: "Summary (Bangla)", type: "textarea" },
      { name: "excerpt.en", label: "Summary (English)", type: "textarea" },
      { name: "content.bn", label: "Details (Bangla)", type: "textarea" },
      { name: "content.en", label: "Details (English)", type: "textarea" },
      { name: "cover", label: "Cover image", type: "media" },
      { name: "gallery", label: "Project gallery", type: "media-list" },
      { name: "location.bn", label: "Location (Bangla)" },
      { name: "location.en", label: "Location (English)" },
      { name: "client", label: "Client" },
      { name: "capacity", label: "Capacity" },
      { name: "sortOrder", label: "Display order", type: "number" },
      { name: "featured", label: "Featured", type: "checkbox" },
      { name: "isActive", label: "Active", type: "checkbox" },
    ],
  },
  products: {
    title: "Products",
    description: "Manage bilingual product listings, price display, and availability.",
    primaryField: "title.en",
    fields: [
      { name: "title.bn", label: "Name (Bangla)", required: true },
      { name: "title.en", label: "Name (English)", required: true },
      { name: "slug", label: "URL slug", required: true },
      { name: "excerpt.bn", label: "Summary (Bangla)", type: "textarea" },
      { name: "excerpt.en", label: "Summary (English)", type: "textarea" },
      { name: "description.bn", label: "Description (Bangla)", type: "textarea" },
      { name: "description.en", label: "Description (English)", type: "textarea" },
      { name: "cover", label: "Cover image", type: "media" },
      { name: "images", label: "Product images", type: "media-list" },
      { name: "price.amount", label: "Price (BDT)", type: "number" },
      { name: "price.currency", label: "Currency code" },
      { name: "price.showPrice", label: "Show price", type: "checkbox" },
      { name: "price.callForPrice", label: "Call for price", type: "checkbox" },
      {
        name: "specs",
        label: "Specifications (one per line: Bangla label | English label | value)",
        type: "specs",
      },
      {
        name: "stockStatus",
        label: "Stock status",
        type: "select",
        options: [
          { label: "In stock", value: "in_stock" },
          { label: "Out of stock", value: "out_of_stock" },
          { label: "Pre-order", value: "pre_order" },
        ],
      },
      { name: "sortOrder", label: "Display order", type: "number" },
      { name: "featured", label: "Featured", type: "checkbox" },
      { name: "isActive", label: "Active", type: "checkbox" },
    ],
  },
  blog: {
    title: "Blog posts",
    description: "Create bilingual articles and choose whether to save them as drafts or publish.",
    primaryField: "title.en",
    fields: [
      { name: "title.bn", label: "Title (Bangla)", required: true },
      { name: "title.en", label: "Title (English)", required: true },
      { name: "slug", label: "URL slug", required: true },
      { name: "excerpt.bn", label: "Excerpt (Bangla)", type: "textarea" },
      { name: "excerpt.en", label: "Excerpt (English)", type: "textarea" },
      { name: "content.bn", label: "Article (Bangla)", type: "richtext" },
      { name: "content.en", label: "Article (English)", type: "richtext" },
      { name: "cover", label: "Cover image", type: "media" },
      { name: "tags", label: "Tags (comma separated)", type: "list" },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: [
          { label: "Draft", value: "draft" },
          { label: "Published", value: "published" },
        ],
      },
    ],
  },
  categories: {
    title: "Categories",
    description: "Group services, projects, products, and articles into categories.",
    primaryField: "name.en",
    fields: [
      {
        name: "kind",
        label: "Content type",
        type: "select",
        required: true,
        options: [
          { label: "Service", value: "service" },
          { label: "Project", value: "project" },
          { label: "Product", value: "product" },
          { label: "Post", value: "post" },
        ],
      },
      { name: "name.bn", label: "Name (Bangla)", required: true },
      { name: "name.en", label: "Name (English)", required: true },
      { name: "slug", label: "Slug", required: true },
      { name: "description.bn", label: "Description (Bangla)", type: "textarea" },
      { name: "description.en", label: "Description (English)", type: "textarea" },
      { name: "sortOrder", label: "Display order", type: "number" },
      { name: "isActive", label: "Active", type: "checkbox" },
    ],
  },
  testimonials: {
    title: "Testimonials",
    description: "Manage the customer feedback displayed on the site.",
    primaryField: "name",
    fields: [
      { name: "name", label: "Customer name", required: true },
      { name: "role.bn", label: "Role (Bangla)" },
      { name: "role.en", label: "Role (English)" },
      { name: "quote.bn", label: "Quote (Bangla)", type: "textarea", required: true },
      { name: "quote.en", label: "Quote (English)", type: "textarea", required: true },
      { name: "rating", label: "Rating (1–5)", type: "number" },
      { name: "sortOrder", label: "Display order", type: "number" },
      { name: "isActive", label: "Active", type: "checkbox" },
    ],
  },
  faqs: {
    title: "FAQs",
    description: "Add and organize bilingual frequently asked questions.",
    primaryField: "question.en",
    fields: [
      { name: "question.bn", label: "Question (Bangla)", type: "textarea", required: true },
      { name: "question.en", label: "Question (English)", type: "textarea", required: true },
      { name: "answer.bn", label: "Answer (Bangla)", type: "textarea", required: true },
      { name: "answer.en", label: "Answer (English)", type: "textarea", required: true },
      { name: "category", label: "Category" },
      { name: "sortOrder", label: "Display order", type: "number" },
      { name: "isActive", label: "Active", type: "checkbox" },
    ],
  },
  navigation: {
    title: "Navigation",
    description: "Manage the site menu links and their placement.",
    primaryField: "label.en",
    fields: [
      { name: "label.bn", label: "Label (Bangla)", required: true },
      { name: "label.en", label: "Label (English)", required: true },
      { name: "href", label: "Link URL", required: true },
      {
        name: "location",
        label: "Menu location",
        type: "select",
        options: [
          { label: "Header", value: "header" },
          { label: "Footer", value: "footer" },
          { label: "Mobile", value: "mobile" },
        ],
      },
      { name: "sortOrder", label: "Display order", type: "number" },
      { name: "openInNewTab", label: "Open in new tab", type: "checkbox" },
      { name: "isActive", label: "Active", type: "checkbox" },
    ],
  },
};

function getPath(source: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => {
    if (typeof current !== "object" || current === null) return undefined;
    return (current as Record<string, unknown>)[key];
  }, source);
}

function setPath(target: Record<string, unknown>, path: string, value: unknown) {
  const keys = path.split(".");
  let current = target;
  for (const key of keys.slice(0, -1)) {
    const existing = current[key];
    if (typeof existing !== "object" || existing === null || Array.isArray(existing)) {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }
  current[keys[keys.length - 1]] = value;
}

function formValues(form: HTMLFormElement, fields: Field[]) {
  const formData = new FormData(form);
  const values: Record<string, unknown> = {};

  for (const field of fields) {
    const raw = formData.get(field.name);
    let value: unknown;
    switch (field.type) {
      case "checkbox":
        value = raw === "on";
        break;
      case "number":
        value = raw ? Number(raw) : 0;
        break;
      case "list":
        value =
          typeof raw === "string"
            ? raw
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
            : [];
        break;
      case "media":
      case "media-list":
        value = typeof raw === "string" ? JSON.parse(raw) : field.type === "media-list" ? [] : {};
        break;
      case "specs":
        value =
          typeof raw === "string"
            ? raw
                .split(/\r?\n/)
                .map((line) => line.split("|").map((part) => part.trim()))
                .filter((parts) => parts.some(Boolean))
                .map(([bn = "", en = "", specValue = ""]) => ({
                  label: { bn, en },
                  value: specValue,
                }))
            : [];
        break;
      default:
        value = typeof raw === "string" ? raw : "";
    }
    setPath(values, field.name, value);
  }
  return values;
}

function fieldValue(record: AdminDocument | undefined, field: Field): unknown {
  if (!record) {
    if (field.type === "checkbox") return ["isActive", "price.callForPrice"].includes(field.name);
    if (field.name === "stockStatus") return "in_stock";
    if (field.name === "status") return "draft";
    if (field.name === "price.currency") return "BDT";
    if (field.name === "rating") return 5;
    if (field.type === "media-list" || field.type === "specs") return [];
    if (field.type === "media")
      return { url: "", publicId: "", alt: { bn: "", en: "" }, width: 0, height: 0 };
    return field.type === "number" ? 0 : "";
  }
  return getPath(record, field.name);
}

function displayValue(value: unknown): string {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "boolean") return value ? "Active" : "Inactive";
  return typeof value === "string" || typeof value === "number" ? String(value) : "";
}

function fieldDisplayValue(value: unknown, type: Field["type"]): string {
  if (type === "specs" && Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item !== "object" || item === null) return "";
        const spec = item as { label?: { bn?: string; en?: string }; value?: string };
        return `${spec.label?.bn ?? ""} | ${spec.label?.en ?? ""} | ${spec.value ?? ""}`;
      })
      .filter(Boolean)
      .join("\n");
  }
  return displayValue(value);
}

function ContentForm({
  resource,
  item,
  fields,
  onSaved,
  locale,
}: {
  resource: AdminResource;
  item?: AdminDocument;
  fields: Field[];
  onSaved: (message: string) => void;
  locale: AdminLocale;
}) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [preview, setPreview] = useState<{
    title: string;
    excerpt: string;
    content: string;
  } | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/content/${resource}${item ? `?id=${encodeURIComponent(item._id)}` : ""}`,
        {
          method: item ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formValues(event.currentTarget, fields)),
        },
      );
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(result.error ?? "Unable to save. Please check the values and try again.");
        return;
      }

      onSaved(item ? "Changes saved." : "Content added.");
      if (!item) event.currentTarget.reset();
    } catch (requestError) {
      console.error("Content save request failed.", requestError);
      setError("Could not reach the server. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      onInput={(event) => {
        if (resource !== "blog") return;
        const values = new FormData(event.currentTarget);
        const get = (name: string) => String(values.get(name) ?? "");
        setPreview({
          title: get("title.en") || get("title.bn"),
          excerpt: get("excerpt.en") || get("excerpt.bn"),
          content: (get("content.en") || get("content.bn")).replace(/<[^>]*>/g, ""),
        });
      }}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => {
          const value = fieldValue(item, field);
          const baseClass =
            "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";

          if (field.type === "checkbox") {
            return (
              <label
                key={field.name}
                className="flex items-center gap-2 rounded-xl border border-slate-200 p-3 text-sm text-slate-700"
              >
                <input
                  type="checkbox"
                  name={field.name}
                  defaultChecked={value === true}
                  className="h-4 w-4 accent-[#4d8d2a]"
                />
                {adminTranslate(locale, field.label)}
              </label>
            );
          }

          if (field.type === "richtext") {
            return (
              <RichTextEditor
                key={field.name}
                name={field.name}
                label={adminTranslate(locale, field.label)}
                value={displayValue(value)}
              />
            );
          }

          if (field.type === "media" || field.type === "media-list") {
            return (
              <MediaPicker
                key={field.name}
                name={field.name}
                label={adminTranslate(locale, field.label)}
                value={value}
                multiple={field.type === "media-list"}
              />
            );
          }

          return (
            <label
              key={field.name}
              className={field.type === "textarea" ? "block sm:col-span-2" : "block"}
            >
              <span className="text-sm font-medium text-slate-700">{adminTranslate(locale, field.label)}</span>
              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  required={field.required}
                  defaultValue={fieldDisplayValue(value, field.type)}
                  rows={4}
                  className={baseClass}
                />
              ) : field.type === "select" ? (
                <select
                  name={field.name}
                  required={field.required}
                  defaultValue={displayValue(value) || field.options?.[0]?.value}
                  className={baseClass}
                >
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {adminTranslate(locale, option.label)}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type === "number" ? "number" : "text"}
                  name={field.name}
                  required={field.required}
                  min={field.type === "number" ? 0 : undefined}
                  step={field.type === "number" ? "any" : undefined}
                  defaultValue={fieldDisplayValue(value, field.type)}
                  className={baseClass}
                />
              )}
            </label>
          );
        })}
      </div>

      {resource === "blog" && preview ? (
        <aside aria-live="polite" className="rounded-2xl border border-brand/40 bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-dark">
            Preview before publish
          </p>
          <h2 className="mt-3 text-xl font-bold text-slate-900">
            {preview.title || "Untitled article"}
          </h2>
          <p className="mt-2 text-sm text-slate-600">{preview.excerpt}</p>
          <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">
            {preview.content}
          </div>
        </aside>
      ) : null}

      {error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-2 disabled:opacity-60"
      >
        {pending ? adminTranslate(locale, "Saving...") : item ? adminTranslate(locale, "Save changes") : adminTranslate(locale, "Add")}
      </button>
    </form>
  );
}

export function ContentManager({
  resource,
  items,
  locale,
}: {
  resource: AdminResource;
  items: AdminDocument[];
  locale: AdminLocale;
}) {
  const router = useRouter();
  const [notice, setNotice] = useState("");
  const config = resourceConfig[resource];

  async function deleteItem(item: AdminDocument) {
    if (!window.confirm("Delete this item? This action cannot be undone.")) return;
    setNotice("");

    try {
      const response = await fetch(
        `/api/admin/content/${resource}?id=${encodeURIComponent(item._id)}`,
        { method: "DELETE" },
      );
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setNotice(result.error ?? "Unable to delete this item.");
        return;
      }
      setNotice("Item deleted.");
      router.refresh();
    } catch (requestError) {
      console.error("Content delete request failed.", requestError);
      setNotice("Could not reach the server. Please try again.");
    }
  }

  return (
    <div className="space-y-8">
      <header className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-dark">
          {adminTranslate(locale, "Content management")}
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">{adminTranslate(locale, config.title)}</h1>
        <p className="mt-2 text-slate-600">{adminTranslate(locale, config.description)}</p>
      </header>

      {notice ? (
        <p
          role="status"
          className="rounded-xl border border-brand/30 bg-brand/10 px-4 py-3 text-sm text-navy"
        >
          {notice}
        </p>
      ) : null}

      <details className="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <summary className="cursor-pointer list-none text-lg font-semibold text-slate-900">
          <span className="inline-flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-navy transition group-open:rotate-45">
              +
            </span>
            {adminTranslate(locale, "Add")} {adminTranslate(locale, config.title.toLowerCase())}
          </span>
        </summary>
        <div className="pt-6">
          <ContentForm
            resource={resource}
            fields={config.fields}
            locale={locale}
            onSaved={(message) => {
              setNotice(message);
              router.refresh();
            }}
          />
        </div>
      </details>

      <Stagger className="grid gap-5">
        {items.map((item) => (
          <StaggerItem key={item._id}>
            <details className="group rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-semibold text-slate-900">
                    {displayValue(getPath(item, config.primaryField)) || "Untitled"}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    {displayValue(getPath(item, "slug")) || item._id}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 group-open:bg-brand/15 group-open:text-brand-dark">
                  {adminTranslate(locale, "Edit")}
                </span>
              </summary>
              <div className="mt-5 border-t border-slate-100 pt-5">
                <ContentForm
                  key={item._id}
                  resource={resource}
                  item={item}
                  fields={config.fields}
                  locale={locale}
                  onSaved={(message) => {
                    setNotice(message);
                    router.refresh();
                  }}
                />
                <button
                  type="button"
                  onClick={() => void deleteItem(item)}
                  className="mt-4 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                >
                  {adminTranslate(locale, "Delete")}
                </button>
              </div>
            </details>
          </StaggerItem>
        ))}
      </Stagger>

      {items.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
          No items yet. Use “Add {config.title.toLowerCase()}” to create the first one.
        </div>
      ) : null}
    </div>
  );
}
