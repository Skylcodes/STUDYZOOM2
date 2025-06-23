/**
 * This file provides type mappings to help with the transition from CRM-oriented models
 * to STUDYZOOM's academic-focused models. It allows existing code to continue working
 * while we gradually refactor the codebase.
 */

// Import and re-export the Prisma namespace for types we need
import { Prisma } from '@prisma/client';
export { Prisma };

// StudySet (formerly Document/Contact)
export interface StudySet {
  id: string;
  title: string;
  filePath: string | null;
  fileType: string | null;
  fileSize: number | null;
  content: Prisma.JsonValue | null;
  notes: string | null;
  uploadDate: Date;
  userId: string;
  categoryId: string | null;
  createdAt: Date;
  updatedAt: Date;
  flashcards: Prisma.JsonValue | null;
  quiz: Prisma.JsonValue | null;
  summary: string | null;
  podcast: string | null;
  generatedAt: Date | null;
}

// ActionItem (formerly ContactTask)
export interface ActionItem {
  id: string;
  title: string;
  description: string | null;
  dueDate: Date | null;
  status: ActionItemStatus;
  userId: string;
  studySetId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// TopicTag (formerly ContactTag)
export interface TopicTag {
  id: string;
  name: string;
  color: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// StudyGroup (formerly Organization)
export interface StudyGroup {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// StudyGroupInvite (formerly Invitation)
export interface StudyGroupInvite {
  id: string;
  email: string;
  name: string | null;
  token: string;
  status: InviteStatus;
  role: Role;
  expires: Date;
  studyGroupId: string;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Enums
export enum ActionItemStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  REVIEW = 'review'
}

export enum InviteStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  REVOKED = 'revoked',
  EXPIRED = 'expired'
}

export enum Role {
  STUDENT = 'student',
  INSTRUCTOR = 'instructor',
  MEMBER = 'member',
  ADMIN = 'admin'
}

export enum DocumentType {
  NOTE = 'note',
  SLIDES = 'slides',
  ASSIGNMENT = 'assignment',
  FLASHCARD = 'flashcard',
  QUIZ = 'quiz'
}

// Legacy type aliases for backward compatibility
export type Contact = StudySet;
export type ContactTask = ActionItem;
export type ContactTaskStatus = ActionItemStatus;
export type ContactTag = TopicTag;
export type Organization = StudyGroup;
export type Invitation = StudyGroupInvite;
export type InvitationStatus = InviteStatus;
export type Document = StudySet;

// Domain-aligned enum for StudySet stages
export enum StudySetStage {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

// Legacy enum for backward compatibility
export enum ContactStage {
  LEAD = 'lead',
  OPPORTUNITY = 'opportunity',
  CUSTOMER = 'customer',
  CHURNED = 'churned'
}

// Legacy enums that don't exist anymore but are referenced in the code
export enum ActionType {
  CREATED = 'created',
  UPDATED = 'updated',
  DELETED = 'deleted',
  COMMENT_ADDED = 'comment_added',
  NOTE_ADDED = 'note_added',
  TASK_ADDED = 'task_added',
  TASK_UPDATED = 'task_updated',
  TASK_COMPLETED = 'task_completed',
  STAGE_UPDATED = 'stage_updated',
  TAGS_UPDATED = 'tags_updated',
  VISITED_PAGE = 'visited_page'
}

export enum WebhookTrigger {
  CONTACT_CREATED = 'contact.created',
  CONTACT_UPDATED = 'contact.updated',
  CONTACT_DELETED = 'contact.deleted'
}

export enum FeedbackCategory {
  BUG = 'BUG',
  FEATURE_REQUEST = 'FEATURE_REQUEST',
  OTHER = 'OTHER'
}

export enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday'
}

// Legacy type for ContactRecord which doesn't exist anymore

// Legacy interface for Webhook which doesn't exist anymore but is referenced in the code
export interface Webhook {
  id: string;
  studyGroupId: string; // Renamed from organizationId for domain alignment
  organizationId?: string; // Kept for backward compatibility
  url: string;
  secret: string | null;
  triggers: WebhookTrigger[];
  createdAt: Date;
  updatedAt: Date;
}
export interface ContactRecord {
  id: string;
  contactId: string;
  url: string;
  userAgent: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Domain-aligned enum for StudySet record type
export enum StudySetRecordType {
  PERSON = 'person',
  COMPANY = 'company',
  DOCUMENT = 'document',
  NOTE = 'note',
  TEXTBOOK = 'textbook',
  ASSIGNMENT = 'assignment'
}

// Legacy enum for backward compatibility
export enum ContactRecordType {
  PERSON = 'person',
  COMPANY = 'company'
}

// Legacy enum for ActorType
export enum ActorType {
  MEMBER = 'member',
  SYSTEM = 'system',
  API = 'api'
}
