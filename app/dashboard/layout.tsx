import * as React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { SidebarRenderer } from '@/components/dashboard/sidebar-renderer';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Routes } from '@/constants/routes';
import { getProfile } from '@/data/account/get-profile';
// Favorites functionality removed as part of pivot to document-centric model
import { dedupedAuth } from '@/lib/auth';
import { getLoginRedirect } from '@/lib/auth/redirect';
import { checkSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import { createTitle } from '@/lib/utils';
import ErrorBoundaryLayout from '@/components/layouts/error-boundary-layout';

export const metadata: Metadata = {
  title: createTitle('StudyZoom Dashboard')
};

export default async function DashboardLayout({
  children
}: React.PropsWithChildren): Promise<React.JSX.Element> {
  const session = await dedupedAuth();
  if (!checkSession(session)) {
    return redirect(getLoginRedirect());
  }

  const userFromDb = await prisma.user.findFirst({
    where: { id: session.user.id },
    select: {
      completedOnboarding: true
    }
  });
  if (!userFromDb?.completedOnboarding) {
    return redirect(Routes.Onboarding);
  }

  // Favorites functionality removed as part of pivot to document-centric model
  const profile = await getProfile();

  return (
    <div className="relative flex h-screen overflow-hidden bg-gradient-to-br from-[#0f0c29] via-[#1a1a2e] to-[#1e1b3b] text-slate-200">
      {/* Cosmic background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/5 via-transparent to-transparent" />
      </div>
      
      <SidebarProvider>
        <SidebarRenderer
          profile={profile}
        />
        {/* Set max-width so full-width tables can overflow horizontally correctly */}
        <SidebarInset
          id="skip"
          className="relative z-10 size-full lg:[transition:max-width_0.2s_linear] lg:peer-data-[state=collapsed]:max-w-[calc(100vw-var(--sidebar-width-icon))] lg:peer-data-[state=expanded]:max-w-[calc(100vw-var(--sidebar-width))]"
        >
          <div className="h-full overflow-y-auto">
            <div className="min-h-full bg-gradient-to-br from-[#0f0c29]/80 via-[#1a1a2e]/80 to-[#1e1b3b]/80 backdrop-blur-sm">
              <ErrorBoundaryLayout>
                {children}
              </ErrorBoundaryLayout>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
