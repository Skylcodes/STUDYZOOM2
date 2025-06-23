import { type Prisma } from '@prisma/client';
import {
  ActionType,
  ActorType,
  type StudySet as Contact
} from '@/types/prisma-mappings';

import { prisma } from '@/lib/db/prisma';

// Fields to check for changes when capturing events
// Using legacy field names for backward compatibility
const fieldsToCheck = [
  'record', // Will be recordType in future
  'image', // Will be filePath in future
  'name', // Will be title in future
  'email',
  'address',
  'phone',
  'stage',
  'tags'
] as const;

type FieldToCheck = (typeof fieldsToCheck)[number];

type ChangeEntry = {
  old: string | null;
  new: string | null;
};

// Changes detected in a study set (formerly contact)
type ContactChanges = {
  [K in FieldToCheck]?: ChangeEntry;
};

// Domain-aligned type for future use
type StudySetChanges = ContactChanges;

// Legacy type name with domain-aligned implementation
type ContactWithTags = Contact & {
  tags: { text: string }[];
  studyGroupId?: string; // Added for compatibility with example-data.ts
};

// Legacy type for backward compatibility
type StudySetWithTags = ContactWithTags;

function safeStringify<T>(value: T): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  return typeof value === 'object' ? JSON.stringify(value) : String(value);
}

function joinTags(tags: { text: string }[]): string {
  return [...new Set(tags.map((tag) => tag.text))].sort().join(',');
}

export function detectChanges(
  currentContact: Partial<ContactWithTags> | null,
  updatedContact: ContactWithTags,
  updateData?: Prisma.StudySetUpdateInput
): ContactChanges {
  const changes: ContactChanges = {};

  for (const field of fieldsToCheck) {
    if (field === 'tags') {
      const oldTags = currentContact?.tags
        ? joinTags(currentContact.tags)
        : null;
      const newTags = joinTags(updatedContact.tags);
      if (oldTags !== newTags) {
        changes.tags = { old: oldTags, new: newTags };
      }
    } else {
      const oldValue = currentContact
        ? safeStringify(currentContact[field as keyof Contact])
        : null;
      const newValue = safeStringify(updatedContact[field as keyof Contact]);
      if (oldValue !== newValue && (!updateData || field in updateData)) {
        changes[field] = { old: oldValue, new: newValue };
      }
    }
  }

  return changes;
}


/**
 * Creates a study set (formerly contact) and captures the creation event
 * @param contactData The data to create the study set with
 * @param actorId The ID of the user creating the study set
 * @returns The created study set with tags
 */
export async function createContactAndCaptureEvent(
  contactData: Prisma.StudySetCreateInput,
  actorId: string
): Promise<ContactWithTags> {
  return await prisma.$transaction(async (tx) => {
    const createdAt = contactData.createdAt ?? new Date();

    const newContact = await (tx as any).studySet.create({
      data: {
        ...contactData,
        createdAt: createdAt,
        updatedAt: createdAt
      },
      include: { tags: true }
    });

    const changes = detectChanges(null, newContact);

    await (tx as any).studySetActivity.create({
      data: {
        contactId: newContact.id, // Using contactId for backward compatibility (will be studySetId in future)
        actionType: ActionType.CREATED,
        actorId,
        actorType: ActorType.MEMBER,
        metadata: changes,
        occurredAt: createdAt
      }
    });

    return newContact;
  });
}

/**
 * Updates a study set (formerly contact) and captures the update event
 * @param contactId The ID of the study set to update
 * @param updateData The data to update the study set with
 * @param actorId The ID of the user updating the study set
 * @returns The changes made to the study set
 */
export async function updateContactAndCaptureEvent(
  contactId: string,
  updateData: Prisma.StudySetUpdateInput,
  actorId: string
): Promise<ContactChanges> {
  return await prisma.$transaction(async (tx) => {
    const currentContact = await (tx as any).studySet.findUnique({
      where: { id: contactId },
      include: { tags: true }
    });

    if (!currentContact) {
      throw new Error('Contact not found');
    }

    const updatedContact = await (tx as any).studySet.update({
      where: { id: contactId },
      data: { ...updateData, updatedAt: new Date() },
      include: { tags: true }
    });

    const changes = detectChanges(currentContact, updatedContact, updateData);

    if (Object.keys(changes).length > 0) {
      await (tx as any).studySetActivity.create({
        data: {
          contactId, // Using contactId for backward compatibility (will be studySetId in future)
          actionType: ActionType.UPDATED,
          actorId,
          actorType: ActorType.MEMBER,
          metadata: changes,
          occurredAt: new Date()
        }
      });
    }

    return changes;
  });
}

// Domain-aligned function aliases for future use
export const createStudySetAndCaptureEvent = createContactAndCaptureEvent;
export const updateStudySetAndCaptureEvent = updateContactAndCaptureEvent;
