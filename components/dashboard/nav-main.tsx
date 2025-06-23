'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupLabel,
  type SidebarGroupProps
} from '@/components/ui/sidebar';
import { aiToolsNavItems, mainNavItems } from '@/constants/nav-items';
import { cn } from '@/lib/utils';

export function NavMain(props: SidebarGroupProps): React.JSX.Element {
  const pathname = usePathname();
  return (
    <SidebarGroup {...props}>
      {/* Main Navigation */}
      <SidebarMenu>
        {mainNavItems.map((item, index) => (
          <SidebarMenuItem key={index}>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(item.href)}
              tooltip={item.title}
            >
              <Link
                href={item.disabled ? '#' : item.href}
                target={item.external ? '_blank' : undefined}
              >
                <div className={cn(
                  'p-1.5 rounded-lg transition-all',
                  pathname.startsWith(item.href)
                    ? 'bg-gradient-to-r from-[#4B7BF5]/20 to-[#9181F2]/20 text-white'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                )}>
                  <item.icon className={cn(
                    'size-4 shrink-0',
                    pathname.startsWith(item.href) ? 'text-[#9181F2]' : ''
                  )} />
                </div>
                <span
                  className={cn(
                    'transition-colors',
                    pathname.startsWith(item.href)
                      ? 'text-white font-medium bg-gradient-to-r from-[#4B7BF5] to-[#9181F2] bg-clip-text text-transparent'
                      : 'text-slate-400 group-hover:text-white'
                  )}
                >
                  {item.title}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>

      {/* AI Tools Navigation */}
      <div className="mt-6">
        <SidebarGroupLabel>AI Tools</SidebarGroupLabel>
        <SidebarMenu>
          {aiToolsNavItems.map((item, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={item.title}
              >
                <Link
                  href={item.disabled ? '#' : item.href}
                  target={item.external ? '_blank' : undefined}
                >
                  <item.icon
                    className={cn(
                      'size-4 shrink-0',
                      pathname.startsWith(item.href)
                        ? 'text-[#9181F2]'
                        : 'text-muted-foreground'
                    )}
                  />
                  <span
                    className={cn(
                      'transition-colors',
                      pathname.startsWith(item.href)
                        ? 'bg-gradient-to-r from-[#4B7BF5] to-[#9181F2] bg-clip-text text-transparent font-medium'
                        : 'text-slate-400 group-hover:text-white'
                    )}
                  >
                    {item.title}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </div>
    </SidebarGroup>
  );
}
