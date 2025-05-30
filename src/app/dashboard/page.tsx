'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    const status = searchParams.get('status');
    if (status === 'success') {
      setMessage('Subscription successful!');
    } else if (status === 'cancel') {
      setMessage('Subscription cancelled.');
    }

   
    if (status) {
      const timer = setTimeout(() => setMessage(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/auth'); 
  }, [router]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Welcome to Your Dashboard</h1>
      <p className="text-gray-600 mb-8 text-center max-w-md"> You are logged in. Get a subscription to unlock premium features like analytics, automation,
        and priority support.
      </p>

      <button
        onClick={() => router.push('/subscription')}
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg text-lg transition-transform hover:scale-105 shadow-md"
      >
        Get Subscription
      </button>
    </main>
  );
}
