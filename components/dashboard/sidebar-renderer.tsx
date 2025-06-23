'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';

import { AppSidebar } from '@/components/dashboard/app-sidebar';
import { SettingsSidebar } from '@/components/dashboard/settings/settings-sidebar';
import { useSidebar } from '@/components/ui/sidebar';
import { Routes } from '@/constants/routes';
// Favorites functionality removed as part of pivot to document-centric model
import { ProfileDto } from '@/types/dtos/profile-dto';

export type SidebarRendererProps = {
  // Favorites functionality removed as part of pivot to document-centric model
  profile: ProfileDto;
};

export function SidebarRenderer(
  props: SidebarRendererProps
): React.JSX.Element {
  const sidebar = useSidebar();
  const pathname = usePathname();

  if (sidebar.isMobile && pathname.startsWith(Routes.Settings)) {
    return <SettingsSidebar />;
  }

  return <AppSidebar {...props} />;
}
