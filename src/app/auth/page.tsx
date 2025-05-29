'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login';

    const res = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();

    if (res.ok) {
      if (!isSignup) {
        localStorage.setItem('token', data.token);
        router.push('/dashboard');
      } else {
        setIsSignup(false); 
      }
    } else {
      alert(data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-20 flex flex-col gap-4">
      <h2 className="text-xl font-bold">{isSignup ? 'Sign Up' : 'Login'}</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="border p-2 rounded"
        required
      />

      <button type="submit" className="bg-black text-white px-4 py-2 rounded">
        {isSignup ? 'Sign Up' : 'Log In'}
      </button>

      <button
        type="button"
        onClick={() => setIsSignup(prev => !prev)}
        className="text-sm underline mt-2"
      >
        {isSignup ? 'Already have an account? Log in' : 'No account? Sign up'}
      </button>
    </form>
  );
}
