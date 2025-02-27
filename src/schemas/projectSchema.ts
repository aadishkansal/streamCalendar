import { z } from "zod";

export const projectSchema = z.object({
    start_date: z.date(),
    end_date: z.date(),
    time_slot_start: z.string(),
    time_slot_end: z.string(),
    title: z.string(),
    days_selected: z.array(z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]))
})

