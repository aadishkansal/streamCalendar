import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProject extends Document {
  userId: Types.ObjectId;
  playlistId: Types.ObjectId;
  title: string;
  dateStart: Date;
  dateEnd: Date;
  timeSlotStart: string;
  timeSlotEnd: string;
  daysSelected: string[];
  streak?: boolean[];
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema: Schema<IProject> = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    playlistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Playlist",
      required: true,
    },
    title: { type: String, required: true, maxLength: 50 },
    dateStart: { type: Date, required: true },
    dateEnd: { type: Date, required: true },
    timeSlotStart: { type: String, required: true },
    timeSlotEnd: { type: String, required: true },
    daysSelected: { type: [String], required: true },
    daysSelected: { type: [bOOLEAN], required: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Project =
  (mongoose.models.Project as mongoose.Model<IProject>) ||
  mongoose.model<IProject>("Project", projectSchema);

export default Project;
