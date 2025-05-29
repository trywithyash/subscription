'use client';

import { useRouter } from 'next/navigation';
import envConfig from '@/config/env';

const plans = [
  { name: 'Basic Monthly', price: '$10 for 30 days', stripePriceId: envConfig.STRIPE_PRICE_MONTHLY_BASIC, description: 'Billed monthly. Cancel anytime.' },
  { name: 'Intermediate Monthly', price: '$20 for 30 days', stripePriceId: envConfig.STRIPE_PRICE_MONTHLY_INTERMEDIATE, description: 'Billed monthly. Cancel anytime.' },
  { name: 'Pro Monthly', price: '$30 for 30 days', stripePriceId: envConfig.STRIPE_PRICE_MONTHLY_PRO, description: 'Billed monthly. Cancel anytime.' },
  { name: 'Basic Yearly', price: '$100 for 365 days', stripePriceId: envConfig.STRIPE_PRICE_YEARLY_BASIC, description: 'Billed yearly. Save 15%.' },
  { name: 'Intermediate Yearly', price: '$200 for 365 days', stripePriceId: envConfig.STRIPE_PRICE_YEARLY_INTERMEDIATE, description: 'Billed yearly. Save 15%.' },
  { name: 'Pro Yearly', price: '$300 for 365 days', stripePriceId:envConfig.STRIPE_PRICE_YEARLY_PRO, description: 'Billed yearly. Save 15%.' },
];


export default function SubscriptionPage() {
  const router = useRouter();

  const handleSubscribe = async (priceId: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push(data.url);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Subscription failed.', );
      console.error('Error:', err); 
    }
  };

  return (
    <main className="min-h-screen bg-white py-20 px-6">
      <h1 className="text-4xl font-bold text-center mb-10">Choose Your Plan</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map(plan => (
          <div
            key={plan.name}
            className="border border-gray-200 rounded-xl p-6 shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-b from-white to-gray-50"
          >
            <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
            <p className="text-gray-700 mb-4">{plan.description}</p>
            <div className="text-3xl font-bold mb-6">{plan.price}</div>
            <button
              onClick={() => handleSubscribe(plan.stripePriceId!)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-all"
            >
              Subscribe
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
