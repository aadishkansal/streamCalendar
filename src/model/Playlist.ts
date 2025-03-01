import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPlaylist extends Document {
  playlistId: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  totalVideos: number;
  totalDuration: string;
  channelName: string;
  videos: {
    title: string;
    url: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})(:[0-9]{1,5})?(\/[^\s]*)?$/;

const PlaylistSchema: Schema<IPlaylist> = new mongoose.Schema(
  {
    playlistId: { type: String, required: true, unique: true },
    title: { type: String, required: true, maxLength: 100 },
    description: { type: String, required: true },
    url: {
      type: String,
      required: true,
      validate: {
        validator: (url: string) => urlRegex.test(url),
        message: "Invalid URL format",
      },
    },
    thumbnail: { type: String, required: true },
    totalVideos: { type: Number, required: true },
    totalDuration: { type: String, required: true },
    channelName: { type: String, required: true },
    videos: [
      {
        title: { type: String, required: true },
        url: {
          type: String,
          required: true,
          validate: {
            validator: (url: string) => urlRegex.test(url),
            message: "Invalid video URL format",
          },
        },
      },
    ],
  },
  { timestamps: true }
);

const Playlist =
  (mongoose.models.Playlist as mongoose.Model<IPlaylist>) ||
  mongoose.model<IPlaylist>("Playlist", PlaylistSchema);

export default Playlist;
