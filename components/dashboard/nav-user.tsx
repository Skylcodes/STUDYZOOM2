'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import NiceModal from '@ebay/nice-modal-react';
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

import { logOut } from '@/actions/auth/log-out';
import { CommandMenu } from '@/components/dashboard/command-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  type SidebarGroupProps
} from '@/components/ui/sidebar';
import { Routes } from '@/constants/routes';
import { isDialogOpen } from '@/lib/browser/is-dialog-open';
import { isInputFocused } from '@/lib/browser/is-input-focused';
import { isMac } from '@/lib/browser/is-mac';
import { cn } from '@/lib/utils';

// Simple function to get initials from a name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}
import type { ProfileDto } from '@/types/dtos/profile-dto';

export type NavUserProps = SidebarGroupProps & {
  profile: {
    name: string;
    email?: string;
    image?: string;
  };
};

export function NavUser({
  profile,
  ...other
}: NavUserProps): React.JSX.Element {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const handleNavigateToProfilePage = (): void => {
    router.push(Routes.Profile);
  };
  const handleNavigateToBillingPage = (): void => {
    router.push(Routes.Billing);
  };
  const handleShowCommandMenu = (): void => {
    NiceModal.show(CommandMenu);
  };
  const handleLogOut = async (): Promise<void> => {
    const result = await logOut({ redirect: true });
    if (result?.serverError || result?.validationErrors) {
      toast.error("Couldn't log out");
    }
  };

  React.useEffect(() => {
    const mac = isMac();
    const hotkeys: Record<string, { action: () => void; shift: boolean }> = {
      p: { action: handleNavigateToProfilePage, shift: true },
      b: { action: handleNavigateToBillingPage, shift: true },
      k: { action: handleShowCommandMenu, shift: false },
      l: { action: handleLogOut, shift: true }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isDialogOpen() || isInputFocused()) return;

      const modifierKey = mac ? e.metaKey : e.ctrlKey;
      if (!modifierKey) return;

      const hotkey = hotkeys[e.key];
      if (!hotkey) return;
      if (hotkey.shift && !e.shiftKey) return;

      e.preventDefault();
      hotkey.action();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <SidebarGroup {...other} className={cn('p-3', other.className)}>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                asChild
                variant="outline"
                className="group-data-[collapsible=icon]:!px-2.5 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                tooltipContent={
                  `${profile.name}\n${profile.email || ''}`
                }
              >
                <div className="flex w-full items-center gap-3 group">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#4B7BF5] to-[#9181F2] rounded-full opacity-75 group-hover:opacity-100 blur transition-all duration-300 group-hover:duration-200" />
                    <Avatar className="size-9 relative ring-2 ring-white/10 ring-offset-2 ring-offset-[#0f0c29] bg-[#1a1a3a]">
                      <AvatarImage
                        src={profile.image ?? ''}
                        alt={profile.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-[#4B7BF5] to-[#9181F2] text-white">
                        {getInitials(profile.name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 text-left overflow-hidden">
                    <div className="truncate text-sm font-medium text-white">
                      {profile.name}
                    </div>
                    <div className="truncate text-xs text-slate-400 group-hover:text-[#9181F2] transition-colors">
                      {profile.email}
                    </div>
                  </div>
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
                className="w-64 bg-[#0f0c29] border border-white/10 rounded-xl shadow-2xl overflow-hidden p-1.5 space-y-1"
                align="start"
                sideOffset={8}
                alignOffset={-16}
              >
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onSelect={handleNavigateToProfilePage}
                    className="rounded-lg px-3 py-2 text-sm focus:bg-white/10 focus:text-white cursor-pointer transition-colors"
                  >
                    <span className="text-slate-300 group-hover:text-white">Profile</span>
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={handleNavigateToBillingPage}
                    className="rounded-lg px-3 py-2 text-sm focus:bg-white/10 focus:text-white cursor-pointer transition-colors"
                  >
                    <span className="text-slate-300 group-hover:text-white">Billing</span>
                    <DropdownMenuShortcut>⇧⌘B</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="border-white/5 my-1" />
                  <DropdownMenuItem
                    onSelect={handleShowCommandMenu}
                    className="rounded-lg px-3 py-2 text-sm focus:bg-white/10 focus:text-white cursor-pointer transition-colors"
                  >
                    <span className="text-slate-300 group-hover:text-white">Command Menu</span>
                    <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                
                <div className="mt-2 pt-2 border-t border-white/5">
                  <div className="px-3 py-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Theme
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-white/5 rounded-lg">
                    <button
                      onClick={() => setTheme('light')}
                      className={`flex flex-col items-center justify-center gap-1.5 rounded-md p-2 text-xs transition-colors ${
                        theme === 'light'
                          ? 'bg-white/10 text-white'
                          : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <SunIcon className="size-4" />
                      <span>Light</span>
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={`flex flex-col items-center justify-center gap-1.5 rounded-md p-2 text-xs transition-colors ${
                        theme === 'dark'
                          ? 'bg-white/10 text-white'
                          : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <MoonIcon className="size-4" />
                      <span>Dark</span>
                    </button>
                    <button
                      onClick={() => setTheme('system')}
                      className={`flex flex-col items-center justify-center gap-1.5 rounded-md p-2 text-xs transition-colors ${
                        theme === 'system'
                          ? 'bg-white/10 text-white'
                          : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <MonitorIcon className="size-4" />
                      <span>System</span>
                    </button>
                  </div>
                </div>
                
                <DropdownMenuSeparator className="border-white/5 my-1" />
                <DropdownMenuItem
                  onSelect={handleLogOut}
                  className="rounded-lg px-3 py-2 text-sm text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer transition-colors group"
                >
                  <span className="group-hover:text-white">Log out</span>
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
  );
}
