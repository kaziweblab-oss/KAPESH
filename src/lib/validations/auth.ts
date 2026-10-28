import { z } from "zod";

export const userRoles = ["admin", "editor", "author"] as const;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().max(120).email("Please enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters.").max(200),
});

export const createUserSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().max(120).email("Please enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters.").max(200),
  role: z.enum(userRoles).default("editor"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8).max(200),
  newPassword: z.string().min(8, "Password must be at least 8 characters.").max(200),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
