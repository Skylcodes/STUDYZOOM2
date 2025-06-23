'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Routes } from '@/constants/routes';
import { AppInfo } from '@/constants/app-info';

export default function NotFound(): React.JSX.Element {
  const router = useRouter();
  const handleGoBack = (): void => {
    router.back();
  };
  const handleBackToHome = (): void => {
    router.push(Routes.Home);
  };
  const handleToDashboard = (): void => {
    router.push(Routes.Dashboard);
  };
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#1a1a2e] to-[#1e1b3b] p-4 text-white">
      {/* Cosmic background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/5 via-transparent to-transparent" />
      </div>
      
      <div className="relative z-10 flex max-w-md flex-col items-center rounded-lg border border-slate-700/50 bg-slate-900/70 p-8 text-center backdrop-blur-sm">
        <div className="mb-6 rounded-full bg-indigo-900/30 p-4">
          <Search className="h-12 w-12 text-indigo-400" />
        </div>
        
        <span className="bg-gradient-to-r from-violet-400 to-indigo-500 bg-clip-text text-8xl font-extrabold leading-none text-transparent">
          404
        </span>
        
        <h2 className="font-heading my-2 text-2xl font-bold text-white">
          Page Not Found
        </h2>
        
        <p className="mb-6 text-slate-300">
          Sorry, the page you are looking for doesn't exist or has been moved. Continue your learning journey elsewhere in {AppInfo.APP_NAME}.
        </p>
        
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            variant="default"
            onClick={handleGoBack}
          >
            Go Back
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={handleToDashboard}
          >
            To Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
