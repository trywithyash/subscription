import stripe from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const { priceId, coupon } = await req.json();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      discounts: coupon ? [{ coupon }] : [],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?status=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?status=cancel`,
    });
  return NextResponse.json({ url: session.url });

  } catch (error:any) {
    console.log("CHECKOUT ERROR:", error);
    return NextResponse.json({
      message: error.message || "Internal Server error",
    });
  }
}
