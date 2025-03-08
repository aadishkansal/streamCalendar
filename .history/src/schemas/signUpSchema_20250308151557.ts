import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, { message: "Username must be at least 2 characters" })
  .max(20, { message: "Username must not be more than 20 characters" })
  .regex(/^[a-z0-9._]+$/, "Username must be lowercase and can only contain letters, numbers, dots, and underscores");

export const signUpSchema = z.object({
  name: z.string(),
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});
