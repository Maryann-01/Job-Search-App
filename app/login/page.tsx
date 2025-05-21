"use client";
import React from 'react'; 
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from "react";

function LoginContent() {
  const { login, user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  const [error, setError] = useState("");

  useEffect(() => {
    
    if (!loading && user) {
      if (redirect) {
        router.push(redirect);
      } else {
        router.push('/');
      }
    }
  }, [loading, user, router, redirect]);

  useEffect(() => {
    if (!loading && !user) {
      const urlError = searchParams.get('error');
      if (urlError) setError(decodeURIComponent(urlError));
    }
  }, [loading, user, searchParams]);

  const handleLogin = async () => {
    try {
      await login();

    } catch (error) {
      setError("Login failed. Please try again.");
      console.error("Login error:", error);
    }
  };

  
  if (loading || user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          onClick={handleLogin}
          className="w-full bg-[#0057ff] text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}