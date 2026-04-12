'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Dashboard from '@/components/Dashboard';
import LandingPage from '@/components/LandingPage';
import Logo from '@/components/Logo';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        {/* Animated background logo */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center -z-10">
          <div className="w-[600px] h-[600px] opacity-[0.02] animate-pulse">
            <Logo width={600} height={600} />
          </div>
        </div>
        <div className="text-center relative z-10 flex flex-col items-center">
          <div className="relative mb-8 group">
            <div className="absolute inset-0 bg-accent-cyan/20 blur-xl opacity-50 group-hover:opacity-100 transition-opacity animate-pulse"></div>
            <Logo width={80} height={80} className="relative z-10 animate-bounce" />
          </div>
          <div className="text-3xl font-bold text-white tracking-tight font-display mb-2 drop-shadow-lg">FreaQ</div>
          <div className="text-accent-cyan text-sm tracking-widest uppercase mb-4 animate-pulse">System Initiating</div>
          <div className="w-48 h-1 bg-surface-elevated rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-accent-cyan to-accent-blue rounded-full animate-loader"></div>
          </div>
        </div>
      </div>
    );
  }

  if (session) {
    return <Dashboard />;
  }

  return <LandingPage />;
}
