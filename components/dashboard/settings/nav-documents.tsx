'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileTextIcon, ShareIcon, SettingsIcon } from 'lucide-react';

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  type SidebarGroupProps
} from '@/components/ui/sidebar';
import { Routes } from '@/constants/routes';
import { cn } from '@/lib/utils';

// Document navigation items
const documentNavItems = [
  {
    title: 'Settings',
    href: Routes.DocumentSettings,
    icon: SettingsIcon
  },
  {
    title: 'Sharing',
    href: Routes.DocumentSharing,
    icon: ShareIcon
  },
  {
    title: 'Preferences',
    href: Routes.DocumentPreferences,
    icon: FileTextIcon
  }
];

export function NavDocuments(props: SidebarGroupProps): React.JSX.Element {
  const pathname = usePathname();
  return (
    <SidebarGroup
      title="Documents"
      {...props}
    >
      <SidebarMenu>
        {documentNavItems.map((item, index) => (
          <SidebarMenuItem key={index}>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(item.href)}
            >
              <Link href={item.href}>
                <item.icon
                  className={cn(
                    'size-4 shrink-0',
                    pathname.startsWith(item.href)
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  )}
                />
                <span
                  className={
                    pathname.startsWith(item.href)
                      ? 'dark:text-foreground'
                      : 'dark:text-muted-foreground'
                  }
                >
                  {item.title}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
