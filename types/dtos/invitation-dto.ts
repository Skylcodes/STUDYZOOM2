import { type StudyGroupInvite, type InviteStatus, type Role } from '../prisma-mappings';

export type InvitationDto = StudyGroupInvite & {
  lastSent?: Date; // Additional field not in the model
  dateAdded?: Date; // Legacy field (maps to createdAt)
};
