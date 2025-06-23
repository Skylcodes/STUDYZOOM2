'use client';

import * as React from 'react';

// Favorites functionality removed as part of pivot to document-centric model
import { NavMain } from '@/components/dashboard/nav-main';
import { NavSupport } from '@/components/dashboard/nav-support';
import { NavUser } from '@/components/dashboard/nav-user';
import { Logo } from '@/components/ui/logo';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';
import { MediaQueries } from '@/constants/media-queries';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';
// Favorites functionality removed as part of pivot to document-centric model
import type { ProfileDto } from '@/types/dtos/profile-dto';

export type AppSidebarProps = {
  // Favorites functionality removed as part of pivot to document-centric model
  profile: ProfileDto;
};

export function AppSidebar({
  profile
}: AppSidebarProps): React.JSX.Element {
  const sidebar = useSidebar();
  const xlUp = useMediaQuery(MediaQueries.XlUp, { ssr: true, fallback: true });
  const isCollapsed = !sidebar.isMobile && !sidebar.open;
  const showLogo = !isCollapsed || !xlUp;
  React.useEffect(() => {
    sidebar.setOpen(xlUp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xlUp]);
  return (
    <Sidebar 
      collapsible="icon" 
      className="bg-gradient-to-b from-[#0f0c29] via-[#1a1a2e] to-[#1e1b3b] border-r border-white/5 shadow-xl backdrop-blur-lg"
      style={{
        backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(75, 123, 245, 0.15) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(145, 129, 242, 0.15) 0%, transparent 40%)',
      }}
    >
      <SidebarHeader className="px-4 py-5 border-b border-white/5">
        <div
          className={cn(
            'flex h-10 w-full flex-row items-center justify-between',
            !isCollapsed && 'pl-0.5'
          )}
        >
          {showLogo && (
            <Logo className="truncate transition-[width,height,padding] text-primary" />
          )}
          {xlUp && (
            <SidebarTrigger
              icon={isCollapsed ? 'menu' : 'chevronLeft'}
              className="shrink-0 rounded-full text-muted-foreground hover:bg-sidebar-accent/30 hover:text-[#9181F2] transition-colors"
            />
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="overflow-hidden px-3 py-4">
        <ScrollArea
          verticalScrollBar
          /* Overriding the hardcoded { disply:table } to get full flex height */
          className="h-full [&>[data-radix-scroll-area-viewport]>div]:!flex [&>[data-radix-scroll-area-viewport]>div]:h-full [&>[data-radix-scroll-area-viewport]>div]:flex-col"
        >
          <NavMain className="mt-2" />
          {/* Favorites functionality removed as part of pivot to document-centric model */}
          <NavSupport
            profile={profile}
            className="mt-auto pb-0"
          />
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="border-t border-white/5 bg-gradient-to-r from-[#0f0c29] to-[#1a1a3a] backdrop-blur-lg p-0 overflow-hidden">
        <NavUser
          profile={profile}
          className="p-2"
        />
      </SidebarFooter>
    </Sidebar>
  );
}
