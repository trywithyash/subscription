import mongoose, { Document, Schema } from 'mongoose';

export interface IRefundDetails {
  refundedAt: Date;
  refundId: string;
  amount: number;
  reason: string;
}

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  plan: string;
  priceId: string;
  status: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date;
  coupon?: string;
  refunded: boolean;
  refundDetails?: IRefundDetails;
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    stripeCustomerId: { type: String, required: true },
    stripeSubscriptionId: { type: String, required: true, unique: true },
    plan: { type: String, required: true },
    priceId: { type: String, required: true },
    status: { type: String, required: true },
    currentPeriodStart: { type: Date },
    currentPeriodEnd: { type: Date },
    cancelAtPeriodEnd: { type: Boolean, default: false },
    canceledAt: { type: Date },
    coupon: { type: String },
    refunded: { type: Boolean, default: false },
    refundDetails: {
      refundedAt: Date,
      refundId: String,
      amount: Number,
      reason: String
    }
  },
  { timestamps: true }
);

const Subscription =
  mongoose.models.Subscription ||
  mongoose.model<ISubscription>('Subscription', subscriptionSchema);

export default Subscription;