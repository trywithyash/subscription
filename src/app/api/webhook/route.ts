import { buffer } from "micro";
import Stripe from "stripe";
import { connectDB } from "@/config/db";
import { User } from "@/models/userModel";
import envConfig from "@/config/env";

const stripe = new Stripe(envConfig.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil", 
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error("Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  await connectDB();

  try {
    switch (event.type) {
     case "checkout.session.completed": {
  const session = event.data.object as Stripe.Checkout.Session;
  const customerId = session.customer as string;

  const user = await User.findOne({ stripeCustomerId: customerId });
  if (user && session.subscription) {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    ) as Stripe.Subscription;

    user.isSubscribed = true;
    user.subscriptionStatus = subscription.status as any;
    user.subscriptionPlan = session.metadata?.plan || "basic";
    user.subscriptionEndsAt = subscription.current_period_end
      ? new Date(subscription.current_period_end * 1000)
      : undefined;
    user.stripeSubscriptionId = subscription.id;
    await user.save();

    await sendSubscriptionEmail(user.email, user.subscriptionPlan);
  }
  break;
}


      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        const user = await User.findOne({ stripeCustomerId: subscription.customer as string });
        if (user) {
            user.isSubscribed = true;
          user.isSubscribed = ["active", "trialing"].includes(subscription.status);
          user.subscriptionStatus = subscription.status as any;
          user.subscriptionPlan = subscription.items.data[0]?.price.nickname || "basic";

          user.subscriptionEndsAt = subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000)
            : undefined;

          user.stripeSubscriptionId = subscription.id;
          await user.save();
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const user = await User.findOne({ stripeCustomerId: subscription.customer as string });
        if (user) {
          user.isSubscribed = false;
          user.subscriptionStatus = "canceled";
          user.subscriptionEndsAt = subscription.ended_at
            ? new Date(subscription.ended_at * 1000)
            : undefined;

          user.stripeSubscriptionId = undefined;
          await user.save();
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const user = await User.findOne({ stripeCustomerId: invoice.customer as string });
        if (user) {
          user.subscriptionStatus = "past_due";
          await user.save();
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook processing error:", err);
    res.status(500).send("Internal Server Error");
  }
}
