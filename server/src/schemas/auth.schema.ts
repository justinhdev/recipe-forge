import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .email("Enter a valid email address")
  .transform((email) => email.toLowerCase());
const registerPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(128, "Password must be 128 characters or fewer");
const loginPasswordSchema = z
  .string()
  .min(1, "Password is required")
  .max(128, "Password must be 128 characters or fewer");

export const registerUserBodySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or fewer"),
  email: emailSchema,
  password: registerPasswordSchema,
});

export const loginUserBodySchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
});

export type RegisterUserBody = z.infer<typeof registerUserBodySchema>;
export type LoginUserBody = z.infer<typeof loginUserBodySchema>;
