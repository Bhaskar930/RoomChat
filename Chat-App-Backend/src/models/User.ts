import mongoose, { Document, Schema } from "mongoose";

export interface UserDocument extends Document {
  googleId: string;
  name: string;
  email: string;
  avatar?: string;
}

const userSchema = new Schema<UserDocument>({
  googleId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: String,
}, { timestamps: true });

export const User = mongoose.model<UserDocument>("User", userSchema);
