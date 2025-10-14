import mongoose, { Schema, Document } from "mongoose";

export interface IVideoSelection extends Document {
  projectId: mongoose.Types.ObjectId;
  videoIds: string[];
}

const videoSelectionSchema = new Schema<IVideoSelection>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    videoIds: { type: [String], required: true },
  },
  { timestamps: true }
);

export default mongoose.models.VideoSelection ||
  mongoose.model<IVideoSelection>("VideoSelection", videoSelectionSchema);
