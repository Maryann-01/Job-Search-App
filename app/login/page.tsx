"use client";
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from "react";

export default function LoginPage() {
  const { login, user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      const urlError = searchParams.get('error');
      if (urlError) setError(decodeURIComponent(urlError));
    }
  }, [loading, user, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        <button
          onClick={login}
          className="w-full bg-[#0057ff] text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}