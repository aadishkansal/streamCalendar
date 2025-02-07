import { z } from "zod";

export const projectSchema = z.object({
    start_date: z.date(),
    end_date: z.date(),
    time_slot_start: z.string(),
    time_slot_end: z.string(),
    name: z.string(),
    days_per_week: z.string()
})

