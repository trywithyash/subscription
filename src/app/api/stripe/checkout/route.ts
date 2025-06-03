import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import jwt from 'jsonwebtoken';

import envConfig from '@/config/env';
import { connectDB } from '@/config/db';
import { User } from '@/models/userModel';

const stripe = new Stripe(envConfig.STRIPE_SECRET_KEY, {
  apiVersion: '2025-04-30.basil',
});

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token found" }, { status: 401 });
    }
    let decoded: any;
    try {
      decoded = jwt.verify(token, envConfig.JWT_SECRET);
    } catch (err) {
      console.error('JWT verification failed:', err);
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const userId = decoded.id;
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 400 });
    }

    const { priceId, coupon } = await req.json();
    if (!priceId) {
      return NextResponse.json({ error: 'Missing priceId' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user._id.toString() },
      });
      user.stripeCustomerId = customer.id;
      await user.save();
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      mode: 'subscription',
      customer: user.stripeCustomerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${envConfig.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${envConfig.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
      metadata: { userId: user._id.toString(), email: user.email },
    };

  if (coupon) {
  const promotionCodes = await stripe.promotionCodes.list({
    code: coupon,
    active: true,
  });

  if (promotionCodes.data.length > 0) {
    sessionParams.discounts = [{ promotion_code: promotionCodes.data[0].id }];
  } else {
    return NextResponse.json({ error: 'Invalid or expired promotion code' }, { status: 400 });
  }
}

const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });

  } catch (err) {
    console.error("UNHANDLED ERROR:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
