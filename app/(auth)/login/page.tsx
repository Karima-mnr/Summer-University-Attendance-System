'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/lib/store/auth.store';
import { toast } from 'sonner';

export default function LoginPage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (data.success) {
        login();
        toast.success('Welcome! Redirecting to dashboard...');
        router.push('/dashboard');
      } else {
        toast.error('Invalid access code. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-green-800">Summer University</h1>
            <p className="text-gray-600 mt-2">Attendance Management System</p>
            <div className="mt-4 h-1 w-20 bg-green-600 mx-auto rounded-full" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Code
              </label>
              <input
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6-digit access code"
                maxLength={6}
                className="w-full px-4 py-3 text-2xl text-center tracking-widest border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full bg-green-700 hover:bg-green-800 disabled:bg-green-300 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-lg shadow-green-700/30 disabled:shadow-none"
            >
              {loading ? 'Verifying...' : 'Access Dashboard'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Enter the 6-digit access code provided by the organizer
          </p>
        </div>
      </div>
    </div>
  );
}