'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Dashboard from '@/components/Dashboard';
import LandingPage from '@/components/LandingPage';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-accent-blue opacity-20"></div>
            <div className="absolute inset-0 rounded-full border-t-2 border-accent-cyan animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-t-2 border-accent-green animate-spin" style={{ animationDuration: '1.5s' }}></div>
          </div>
          <div className="gradient-text text-2xl font-bold font-display">FreaQ</div>
          <div className="text-text-secondary text-sm mt-2">Loading trading platform...</div>
        </div>
      </div>
    );
  }

  if (session) {
    return <Dashboard />;
  }

  return <LandingPage />;
}
