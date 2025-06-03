"use client";

import { useState } from "react";
import axios from "axios";
import envConfig from "@/config/env";

const plans = [
  {
    name: "Basic Monthly",
    stripePriceId: envConfig.STRIPE_PRICE_MONTHLY_BASIC,
    plan: "basic",
    description: "Billed monthly. Cancel anytime.",
  },
  {
    name: "Intermediate Monthly",
    stripePriceId: envConfig.STRIPE_PRICE_MONTHLY_INTERMEDIATE,
    plan: "intermediate",
    description: "Billed monthly. Cancel anytime.",
  },
  {
    name: "Pro Monthly",
    stripePriceId: envConfig.STRIPE_PRICE_MONTHLY_PRO,
    plan: "pro",
    description: "Billed monthly. Cancel anytime.",
  },
  {
    name: "Basic Yearly",
    stripePriceId: envConfig.STRIPE_PRICE_YEARLY_BASIC,
    plan: "basic",
    description: "Billed yearly. Save 15%.",
  },
  {
    name: "Intermediate Yearly",
    stripePriceId: envConfig.STRIPE_PRICE_YEARLY_INTERMEDIATE,
    plan: "intermediate",
    description: "Billed yearly. Save 15%.",
  },
  {
    name: "Pro Yearly",
    stripePriceId: envConfig.STRIPE_PRICE_YEARLY_PRO,
    plan: "pro",
    description: "Billed yearly. Save 15%.",
  },
];

export default function SubscriptionPage() {
  const [selectedPriceId, setSelectedPriceId] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [coupon, setCoupon] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!selectedPriceId) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "/api/stripe/checkout",
        { priceId: selectedPriceId, coupon, plan: selectedPlan },
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
      alert("Checkout failed. Please try again or check your coupon code.");
      console.error("Checkout error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-12 max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
      <div className="md:col-span-1 border rounded-lg p-6 shadow">
        <h2 className="text-xl font-semibold mb-4">Promo Code</h2>
        <input
          type="text"
          placeholder="Enter coupon (optional)"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4"
        />
        <button
          onClick={handleSubscribe}
          disabled={!selectedPriceId || loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Purchase Subscription"}
        </button>
      </div>

      {/* Plans section */}
      <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            onClick={() => {
              setSelectedPriceId(plan.stripePriceId);
              setSelectedPlan(plan.plan);
            }}
            className={`border p-6 rounded-lg shadow cursor-pointer transition hover:shadow-lg ${
              selectedPriceId === plan.stripePriceId ? "border-blue-600" : ""
            }`}
          >
            <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
            <p className="text-sm text-gray-600 mb-2">{plan.description}</p>
            <span
              className={`inline-block px-3 py-1 text-sm rounded-full ${
                selectedPriceId === plan.stripePriceId ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
              }`}
            >
              {selectedPriceId === plan.stripePriceId ? "Selected" : "Click to select"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
