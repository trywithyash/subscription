import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  name?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  isSubscribed: boolean;
  subscriptionPlan?: "basic" | "intermediate" | "pro";
  subscriptionStatus?: "active" | "trialing" | "canceled";
  subscriptionEndsAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true, 
      lowercase: true, 
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      trim: true,
    },
    stripeCustomerId: {
      type: String,
    },
    stripeSubscriptionId: {
      type: String,
    },
    isSubscribed: {
      type: Boolean,
      default: false,
    },
    subscriptionPlan: {
      type: String,
      enum: ["basic", "intermediate", "pro"],
    },
    subscriptionStatus: {
      type: String,
      enum: ["active", "trialing", "canceled"],
    },
    subscriptionEndsAt: {
      type: Date,
    },
  },
  {
    timestamps: true, 
  }
);

export const User = models.User || model<IUser>("User", UserSchema);
