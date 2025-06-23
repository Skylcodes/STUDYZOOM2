import { type ActionItem, type ActionItemStatus } from '../prisma-mappings';

export type ActionItemDto = ActionItem & {
  contactId?: string; // Legacy field for backward compatibility (maps to studySetId)
  status: ActionItemStatus;
};

// Backward compatibility export
export type ContactTaskDto = ActionItemDto;
