          import mongoose, { Schema, Document, Types } from "mongoose";

          export interface IProject extends Document {
            user_id: Types.ObjectId;
            playlistId: string;
            title: string;
            start_date: Date;
            end_date: Date;
            days_selected: string[];
            timeSlots: Array<{
              startTime: string;
              endTime: string;
            }>;
            selectedVideos: string[];
            streak?: boolean[];
            completion_timestamps?: (Date | null)[];
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
              days_selected: { type: [String], required: true },
              timeSlots: [
                {
                  startTime: { type: String, required: true },
                  endTime: { type: String, required: true },
                },
              ],
              selectedVideos: { type: [String], required: true },
              streak: { type: [Boolean] },
              completion_timestamps: { type: [Date] },
              completed: { type: Boolean, default: false },
            },
            { timestamps: true }
          );

          const Project =
            (mongoose.models.Project as mongoose.Model<IProject>) ||
            mongoose.model<IProject>("Project", projectSchema);

          export default Project;
