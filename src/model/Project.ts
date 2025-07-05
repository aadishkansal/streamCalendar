import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProject extends Document {
  user_id: Types.ObjectId;
  playlistId: string;
  title: string;
  start_date: Date;
  end_date: Date;
  time_slot_start: string;
  time_slot_end: string;
  days_selected: string[];
  streak?: boolean[];
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema: Schema<IProject> = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    playlistId: {
      type: String,
      required: true,
    },
    title: { type: String, required: true, maxLength: 50 },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    time_slot_start: { type: String, required: true },
    time_slot_end: { type: String, required: true },
    days_selected: { type: [String], required: true },
    streak: { type: [Boolean] },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Project =
  (mongoose.models.Project as mongoose.Model<IProject>) ||
  mongoose.model<IProject>("Project", projectSchema);

export default Project;