import { z } from "zod";

export const Yplaylist = z.object({
    playlistId: z?.string(),
    url: z?.string(),
    title: z.string(),
    thumbnail: z.string(),
    description: z.string(),
    channelName: z.string()
})

export type YplaylistType = z.infer<typeof Yplaylist>;