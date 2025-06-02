"use client";

import envConfig from "@/config/env";
import { useState } from "react";
import axios from 'axios';
const plans = [
  {
    name: "Basic Monthly",
    price: "$10 for 30 days",
    stripePriceId: envConfig.STRIPE_PRICE_MONTHLY_BASIC,
    description: "Billed monthly. Cancel anytime.",
  },
  {
    name: "Intermediate Monthly",
    price: "$20 for 30 days",
    stripePriceId: envConfig.STRIPE_PRICE_MONTHLY_INTERMEDIATE,
    description: "Billed monthly. Cancel anytime.",
  },
  {
    name: "Pro Monthly",
    price: "$30 for 30 days",
    stripePriceId: envConfig.STRIPE_PRICE_MONTHLY_PRO,
    description: "Billed monthly. Cancel anytime.",
  },
  {
    name: "Basic Yearly",
    price: "$100 for 365 days",
    stripePriceId: envConfig.STRIPE_PRICE_YEARLY_BASIC,
    description: "Billed yearly. Save 15%.",
  },
  {
    name: "Intermediate Yearly",
    price: "$200 for 365 days",
    stripePriceId: envConfig.STRIPE_PRICE_YEARLY_INTERMEDIATE,
    description: "Billed yearly. Save 15%.",
  },
  {
    name: "Pro Yearly",
    price: "$300 for 365 days",
    stripePriceId: envConfig.STRIPE_PRICE_YEARLY_PRO,
    description: "Billed yearly. Save 15%.",
  },
];

export default function SubscriptionPage() {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string) => {
  try {
    setLoadingId(priceId);

    const token = localStorage.getItem('token'); 
    const response = await axios.post(
      "/api/stripe/checkout",
      { priceId },
      {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
      }
    );

    if (response.data?.url) {
      window.location.href = response.data.url;
    }
  } catch (err) {
    console.error("Checkout failed", err);
  } finally {
    setLoadingId(null);
  }
};

  return (
    <div className="min-h-screen px-4 py-12 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Choose Your Plan</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="border p-6 rounded-lg shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
            <p className="text-gray-700 mb-2">{plan.price}</p>
            <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
            <button
              disabled={loadingId === plan.stripePriceId}
              onClick={() => handleSubscribe(plan.stripePriceId)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loadingId === plan.stripePriceId ? "Redirecting..." : "Subscribe"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
