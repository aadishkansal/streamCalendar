import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  projectIds: Types.ObjectId[];
  forgotPassCode?: string;
  forgotPassCodeExpiry?: Date;
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    projectIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    forgotPassCode: {
      type: String,
      required: [true, "verify Code is required"],
    },
    forgotPassCodeExpiry: {
      type: Date,
      required: [true, "verify Code Expiry is required"],
    },
  },
  { timestamps: true }
);

const User =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);

export default User;
