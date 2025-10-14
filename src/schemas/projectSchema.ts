import { z } from "zod";

export const projectSchema = z.object({
  start_date: z.date(),
  end_date: z.date(),
  title: z.string().min(1),
  days_selected: z.array(
    z.enum([
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ])
  ),
  timeSlots: z
    .array(
      z.object({
        startTime: z.string(),
        endTime: z.string(),
      })
    )
    .min(1, "At least one time slot is required"),
  selectedVideos: z.array(z.string()).min(1, "At least one video is required"),
});
