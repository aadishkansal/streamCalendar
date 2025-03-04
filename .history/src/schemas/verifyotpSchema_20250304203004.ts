import { z } from "zod";

export const verifyotpSchema = z.object({
    identifier: z.string(),
    password: z.string(),
});