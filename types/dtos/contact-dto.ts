import { type ContactStage, type ContactTag, type StudySet } from '../prisma-mappings';

export interface ContactTagDto extends ContactTag {
  // Any additional fields for the DTO can be added here
  id: string;
  text: string;
}

// Legacy DTO that will be renamed to StudySetDto in future
// This is a transitional interface during domain refactoring
export interface ContactDto {
  id: string;
  name: string; // Maps to title in StudySet
  image?: string; // Maps to filePath in StudySet
  email?: string; // Legacy field, not in StudySet
  phone?: string; // Legacy field, not in StudySet
  address?: string; // Legacy field, not in StudySet
  stage?: ContactStage; // Legacy field, not in StudySet
  tags: ContactTagDto[];
  createdAt: Date; // Required for backward compatibility
}
