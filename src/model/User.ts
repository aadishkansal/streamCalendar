import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  username: string;
  email: string;
  password?: string;
  projectIds: Types.ObjectId[];
  forgotPassCode?: string;
  forgotPassCodeExpiry?: Date;
  provider?: string; 
  providerId?: string; 
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    projectIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    forgotPassCode: {
      type: String,
    },
    forgotPassCodeExpiry: {
      type: Date,
    },
    provider: { type: String },
    providerId: { type: String },
  },
  { timestamps: true }
);

const User =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);

export default User;
