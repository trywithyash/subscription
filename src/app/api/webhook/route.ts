import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import envConfig from "@/config/env";
import { User } from "@/models/userModel";
import mongoose from "mongoose";

const stripe = new Stripe(envConfig.STRIPE_SECRET_KEY, {
  apiVersion: "2025-04-30.basil",
});

export async function POST(req: NextRequest) {
  try {
    const buf = await req.arrayBuffer();
    const rawBody = Buffer.from(buf);

    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return NextResponse.json(
        { error: "Missing Stripe signature" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        envConfig.WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Webhook signature verification failed" },
        { status: 400 }
      );
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(envConfig.MONGODB_URL);
    }

    switch (event.type) {
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId =
          typeof invoice.subscription === "string"
            ? invoice.subscription
            : null;
        const customerId = invoice.customer as string;

        const user = await User.findOne({ stripeCustomerId: customerId });
        if (!user) {
          console.warn(`User with customerId ${customerId} not found.`);
          break;
        }

        user.isSubscribed = true;
        user.subscriptionStatus = "active";
        user.stripeSubscriptionId = subscriptionId;

        if (invoice.lines?.data?.length) {
          const periodEnd = invoice.lines.data[0].period?.end;
          if (periodEnd) {
            user.subscriptionEndsAt = new Date(periodEnd * 1000);
          }
        }

        await user.save();
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const user = await User.findOne({ stripeCustomerId: customerId });
        if (!user) {
          console.warn(`User with customerId ${customerId} not found.`);
          break;
        }

        user.isSubscribed =
          subscription.status === "active" ||
          subscription.status === "trialing";
        user.subscriptionStatus = subscription.status as
          | "active"
          | "trialing"
          | "canceled";
        user.subscriptionPlan =
          subscription.items.data[0]?.price.product.toString() ||
          user.subscriptionPlan;

        await user.save();
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const user = await User.findOne({ stripeCustomerId: customerId });
        if (!user) {
          console.warn(`User with customerId ${customerId} not found.`);
          break;
        }

        user.isSubscribed = false;
        user.subscriptionStatus = "canceled";
        user.subscriptionEndsAt = subscription.ended_at
          ? new Date(subscription.ended_at * 1000)
          : undefined;

        await user.save();
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
