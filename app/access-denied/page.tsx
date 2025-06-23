import React from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Routes } from '@/constants/routes';

export default function AccessDeniedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#1a1a2e] to-[#1e1b3b] p-4 text-white">
      {/* Cosmic background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/5 via-transparent to-transparent" />
      </div>
      
      <div className="relative z-10 flex max-w-md flex-col items-center rounded-lg border border-slate-700/50 bg-slate-900/70 p-8 text-center backdrop-blur-sm">
        <div className="mb-6 rounded-full bg-red-900/30 p-4">
          <Shield className="h-12 w-12 text-red-500" />
        </div>
        
        <h1 className="mb-2 text-2xl font-bold">Access Denied</h1>
        
        <p className="mb-6 text-slate-300">
          You don't have permission to access this resource. This could be because:
        </p>
        
        <ul className="mb-8 list-disc text-left text-slate-300">
          <li className="ml-6 mb-2">You're trying to access content that belongs to another user</li>
          <li className="ml-6 mb-2">You need to be logged in to view this content</li>
          <li className="ml-6 mb-2">Your session may have expired</li>
        </ul>
        
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="default">
            <Link href={Routes.Dashboard}>
              Go to Dashboard
            </Link>
          </Button>
          
          <Button asChild variant="outline">
            <Link href={Routes.Home}>
              Return to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
