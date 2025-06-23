import { type StudyGroup } from '../prisma-mappings';

// Domain-aligned DTO for study group details
export type StudyGroupDetailsDto = Partial<StudyGroup> & {
  name: string;
  description?: string;
  // Fields that might be renamed or removed in future phases
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
};

// For backward compatibility during refactoring
export type OrganizationDetailsDto = StudyGroupDetailsDto;
