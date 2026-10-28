type InquiryEmail = {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
};

type EmailResult =
  | { status: "sent" }
  | { status: "not_configured"; missing: string[] }
  | { status: "failed"; statusCode?: number };

export async function sendInquiryNotification(
  inquiry: InquiryEmail,
  recipient: string,
): Promise<EmailResult> {
  const missing = [
    !process.env.RESEND_API_KEY ? "RESEND_API_KEY" : "",
    !process.env.RESEND_FROM_EMAIL ? "RESEND_FROM_EMAIL" : "",
  ].filter(Boolean);
  if (missing.length || !recipient) {
    if (!recipient) missing.push("INQUIRY_NOTIFICATION_EMAIL or site contact email");
    return { status: "not_configured", missing };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL,
      to: [recipient],
      subject: `New KPESH inquiry from ${inquiry.name}`,
      text: [
        `Name: ${inquiry.name}`,
        `Phone: ${inquiry.phone}`,
        `Email: ${inquiry.email || "Not provided"}`,
        `Service: ${inquiry.service || "Not specified"}`,
        "",
        inquiry.message,
      ].join("\n"),
    }),
    signal: AbortSignal.timeout(10_000),
    cache: "no-store",
  });

  if (!response.ok) {
    console.error("Resend rejected an inquiry notification.", { status: response.status });
    return { status: "failed", statusCode: response.status };
  }
  return { status: "sent" };
}
