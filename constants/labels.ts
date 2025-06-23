import {
  FeedbackCategory,
  Role
} from '@prisma/client';
import { StudySetStage } from '@/types/prisma-mappings';

// Domain-aligned study set stage colors
export const studySetStageColor: Record<StudySetStage, string> = {
  [StudySetStage.NEW]: 'border-blue-500',
  [StudySetStage.IN_PROGRESS]: 'border-yellow-500',
  [StudySetStage.COMPLETED]: 'border-green-500',
  [StudySetStage.ARCHIVED]: 'border-gray-500'
};

// Domain-aligned study set stage labels
export const studySetStageLabel: Record<StudySetStage, string> = {
  [StudySetStage.NEW]: 'New',
  [StudySetStage.IN_PROGRESS]: 'In Progress',
  [StudySetStage.COMPLETED]: 'Completed',
  [StudySetStage.ARCHIVED]: 'Archived'
};

// For backward compatibility
export const contactStageColor = studySetStageColor;
export const contactStageLabel = studySetStageLabel;

export const roleLabels: Record<Role, string> = {
  [Role.STUDENT]: 'Student',
  [Role.INSTRUCTOR]: 'Instructor',
  [Role.MEMBER]: 'Member',
  [Role.ADMIN]: 'Admin'
};

export const feedbackCategoryLabels: Record<FeedbackCategory, string> = {
  [FeedbackCategory.SUGGESTION]: 'Suggestion',
  [FeedbackCategory.PROBLEM]: 'Problem',
  [FeedbackCategory.QUESTION]: 'Question'
};

// Webhook trigger labels removed as part of pivot to document-centric model
