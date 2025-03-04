import { z } from "zod";

export const verifyotpSchema = z.object({
    email: z.string(),
    otp: z.string(),
});