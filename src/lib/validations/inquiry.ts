import { z } from "zod";

export const inquirySources = ["contact", "quote", "product", "service"] as const;

export const inquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  phone: z
    .string()
    .trim()
    .min(6, "Please enter a valid phone number.")
    .max(30)
    .regex(/^[0-9+\-\s()]+$/, "Phone number contains invalid characters."),
  email: z.string().trim().max(120).email("Please enter a valid email.").or(z.literal("")),
  service: z.string().trim().max(80).optional().default(""),
  message: z.string().trim().min(5, "Please describe your requirement.").max(2000),
  source: z.enum(inquirySources).default("contact"),
  website: z.string().max(0).optional(),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
