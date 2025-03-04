import { z } from "zod";

export const verifyotpSchema = z.object({
    password: z.string(),
    confirmPassword: z.string(),
});