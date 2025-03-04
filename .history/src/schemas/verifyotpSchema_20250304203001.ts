import { z } from "zod";

export const verify = z.object({
    identifier: z.string(),
    password: z.string(),
});