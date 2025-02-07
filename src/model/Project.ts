import mongoose, { Schema, Document, Types } from "mongoose";

// Subject to change

export interface IProject extends Document {
  userId: Types.ObjectId;
  titles: string[];
  urls: string[];
  durations: string[];
  completed: Boolean;
  createdAt: Date;
  updatedAt: Date;
}

const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})(:[0-9]{1,5})?(\/[^\s]*)?$/;

const projectSchema: Schema<IProject> = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    titles: [{ type: String, required: true, maxLength: 50 }],
    urls: {
      type: [String], 
      required: true,
      validate: {
        validator: (values: string[]) => values.every((url) => urlRegex.test(url)),
        message: "Invalid URL format",
      },
    },
    durations: {
      type: [String], 
      required: true,
    },
    completed: {type: Boolean, required: true},

  },
  { timestamps: true }
);

const Project =
  (mongoose.models.Project as mongoose.Model<IProject>) ||
  mongoose.model<IProject>("Project", projectSchema);

export default Project;
