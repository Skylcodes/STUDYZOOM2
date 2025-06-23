'use client';

import * as React from 'react';
import NiceModal from '@ebay/nice-modal-react';
import { MessageCircleIcon } from 'lucide-react';

import { FeedbackModal } from '@/components/dashboard/feedback-modal';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  type SidebarGroupProps
} from '@/components/ui/sidebar';
import type { ProfileDto } from '@/types/dtos/profile-dto';

export type NavSupportProps = SidebarGroupProps & {
  profile: ProfileDto;
};

export function NavSupport({
  profile,
  ...other
}: NavSupportProps): React.JSX.Element {
  // Invite member functionality removed as part of pivot to document-centric model
  const handleShowFeedbackModal = (): void => {
    NiceModal.show(FeedbackModal);
  };
  return (
    <SidebarGroup {...other}>
      <SidebarMenu>
        {/* Invite member button removed as part of pivot to document-centric model */}
        <SidebarMenuItem>
          <SidebarMenuButton
            type="button"
            tooltip="Feedback"
            className="text-slate-400 hover:text-[#9181F2] transition-colors"
            onClick={handleShowFeedbackModal}
          >
            <MessageCircleIcon className="size-4 shrink-0 text-current" />
            <span>Feedback</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
