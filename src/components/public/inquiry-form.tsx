"use client";

import { useState } from "react";

export function InquiryForm({ locale }: { locale: "bn" | "en" }) {
  const isBn = locale === "bn";
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const body = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(result.error ?? (isBn ? "বার্তা পাঠানো যায়নি। আবার চেষ্টা করুন।" : "Message could not be sent. Please try again."));
        return;
      }

      form.reset();
      setSent(true);
    } catch (requestError) {
      console.error("Inquiry submission failed.", requestError);
      setError(isBn ? "সার্ভারের সঙ্গে যোগাযোগ করা যায়নি।" : "Could not reach the server.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          {isBn ? "নাম" : "Name"}
          <input
            name="name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={80}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-brand"
            placeholder={isBn ? "আপনার নাম" : "Your name"}
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          {isBn ? "ফোন" : "Phone"}
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            minLength={6}
            maxLength={30}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-brand"
            placeholder={isBn ? "ফোন নম্বর" : "Phone number"}
          />
        </label>
      </div>
      <label className="mt-5 block text-sm font-medium text-slate-700">
        {isBn ? "ইমেইল (ঐচ্ছিক)" : "Email (optional)"}
        <input
          name="email"
          type="email"
          autoComplete="email"
          maxLength={120}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-brand"
          placeholder="hello@example.com"
        />
      </label>
      <label className="mt-5 block text-sm font-medium text-slate-700">
        {isBn ? "আপনার প্রয়োজন" : "Message"}
        <textarea
          name="message"
          required
          minLength={5}
          maxLength={2000}
          className="mt-2 min-h-32 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-brand"
          placeholder={isBn ? "আপনার প্রয়োজন লিখুন" : "Describe your requirement"}
        />
      </label>
      <label aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <input type="hidden" name="source" value="contact" />

      {error ? <p role="alert" className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      {sent ? (
        <p role="status" className="mt-4 rounded-xl bg-brand/10 px-3 py-2 text-sm text-navy">
          {isBn ? "ধন্যবাদ! আপনার বার্তা আমরা পেয়েছি।" : "Thank you! Your message has been received."}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-6 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-semibold text-navy transition hover:bg-brand/90 disabled:opacity-60"
      >
        {pending ? (isBn ? "পাঠানো হচ্ছে..." : "Sending...") : isBn ? "বার্তা পাঠান" : "Send message"}
      </button>
    </form>
  );
}
