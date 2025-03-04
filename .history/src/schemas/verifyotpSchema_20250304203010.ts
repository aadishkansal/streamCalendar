import { z } from "zod";

export const verifyotpSchema = z.object({
    email: z.string(),
    password: z.string(),
});