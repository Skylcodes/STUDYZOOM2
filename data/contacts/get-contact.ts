import 'server-only';

import { unstable_cache as cache } from 'next/cache';
import { notFound, redirect } from 'next/navigation';

import {
  Caching,
  defaultRevalidateTimeInSeconds,
  OrganizationCacheKey,
  StudyGroupCacheKey
} from '@/data/caching';
import { dedupedAuth } from '@/lib/auth';
import { getLoginRedirect } from '@/lib/auth/redirect';
import { checkSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import { ValidationError } from '@/lib/validation/exceptions';
import {
  getContactSchema,
  type GetContactSchema
} from '@/schemas/contacts/get-contact-schema';
import type { ContactDto } from '@/types/dtos/contact-dto';
// Will be renamed to StudySetDto in future

export async function getContact(input: GetContactSchema): Promise<ContactDto> {
  const session = await dedupedAuth();
  if (!checkSession(session)) {
    return redirect(getLoginRedirect());
  }

  const result = getContactSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError(JSON.stringify(result.error.flatten()));
  }
  const parsedInput = result.data;

  return cache(
    async () => {
      const contact = await prisma.studySet.findFirst({
        where: {
          userId: session.user.id,
          id: parsedInput.id
        },
        select: {
          id: true,
          title: true,
          filePath: true,
          fileType: true,
          fileSize: true,
          content: true,
          notes: true,
          uploadDate: true,
          createdAt: true,
          topicTags: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });
      if (!contact) {
        return notFound();
      }

      // Map StudySet fields to legacy ContactDto fields
      const response: ContactDto = {
        id: contact.id,
        name: contact.title, // Use title as name
        image: contact.filePath, // Use filePath as image
        email: undefined, // These fields don't exist in StudySet
        phone: undefined,
        address: undefined,
        stage: undefined,
        createdAt: contact.createdAt,
        tags: contact.topicTags.map(tag => ({
          id: tag.id,
          text: tag.name, // Map name to text for backward compatibility
          name: tag.name, // Add required fields from ContactTag interface
          color: null,
          userId: session.user.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      };

      return response;
    },
    Caching.createStudyGroupKeyParts(
      StudyGroupCacheKey.Contact,
      session.user.studyGroupId || session.user.organizationId,
      parsedInput.id
    ),
    {
      revalidate: defaultRevalidateTimeInSeconds,
      tags: [
        Caching.createStudyGroupTag(
          StudyGroupCacheKey.Contact,
          session.user.studyGroupId || session.user.organizationId,
          parsedInput.id
        )
      ]
    }
  )();
}
