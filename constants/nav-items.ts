import {
  BellIcon,
  BookOpenIcon,
  BrainIcon,
  FileIcon,
  FlaskConicalIcon,
  HomeIcon,
  LockKeyholeIcon,
  MessageSquareIcon,
  MicIcon,
  SettingsIcon,
  StickyNoteIcon,
  UserIcon
} from 'lucide-react';

import { Routes } from '@/constants/routes';
import type { NavItem } from '@/types/nav-item';

export const mainNavItems: NavItem[] = [
  {
    title: 'Home',
    href: Routes.Home,
    icon: HomeIcon
  },
  {
    title: 'Documents',
    href: Routes.Documents, // Updated to use the Documents route
    icon: FileIcon
  },
  {
    title: 'Settings',
    href: Routes.Settings,
    icon: SettingsIcon
  }
];

export const aiToolsNavItems: NavItem[] = [
  {
    title: 'AI Study Buddy',
    href: Routes.AiChatbot,
    icon: BrainIcon
  },
  {
    title: 'Flashcards',
    href: Routes.Flashcards,
    icon: StickyNoteIcon
  },
  {
    title: 'Summaries',
    href: Routes.Summaries,
    icon: BookOpenIcon
  },
  {
    title: 'Quizzes',
    href: Routes.Quizzes,
    icon: FlaskConicalIcon
  },
  {
    title: 'Podcasts',
    href: Routes.Podcasts,
    icon: MicIcon
  },
  {
    title: 'Document Chat',
    href: Routes.DocumentChat,
    icon: MessageSquareIcon
  }
];

export const accountNavItems: NavItem[] = [
  {
    title: 'Profile',
    href: Routes.Profile,
    icon: UserIcon
  },
  {
    title: 'Security',
    href: Routes.Security,
    icon: LockKeyholeIcon
  },
  {
    title: 'Notifications',
    href: Routes.Notifications,
    icon: BellIcon
  }
];

// Organization navigation items removed as part of pivot to document-centric model
