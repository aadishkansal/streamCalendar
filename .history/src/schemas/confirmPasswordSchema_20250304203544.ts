import { z } from "zod";

export const verifyotpSchema = z.object({
    empassword: z.string(),
    password: z.string(),
});