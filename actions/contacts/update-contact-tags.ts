'use server';

import { revalidateTag } from 'next/cache';

import { authActionClient } from '@/actions/safe-action';
import { Caching, StudyGroupCacheKey } from '@/data/caching';
import { updateContactAndCaptureEvent } from '@/lib/db/contact-event-capture';
import { prisma } from '@/lib/db/prisma';
import { NotFoundError } from '@/lib/validation/exceptions';
import { updateContactTagsSchema } from '@/schemas/contacts/update-contact-tags-schema';

export const updateContactTags = authActionClient
  .metadata({ actionName: 'updateContactTags' })
  .schema(updateContactTagsSchema)
  .action(async ({ parsedInput, ctx: { session } }) => {
    // Using (prisma as any) for temporary typing workarounds during transition
    const studySet = await (prisma as any).studySet.findFirst({
      where: {
        studyGroupId: session.user.studyGroupId,
        id: parsedInput.id
      },
      select: {
        tags: {
          select: {
            id: true,
            text: true
          }
        }
      }
    });
    if (!studySet) {
      throw new NotFoundError('Study set not found');
    }

    // Using type assertion to maintain backward compatibility during transition
    await updateContactAndCaptureEvent(
      parsedInput.id,
      {
        tags: {
          connectOrCreate: parsedInput.tags.map((tag) => ({
            where: { text: tag.text },
            create: { text: tag.text }
          })),
          disconnect: studySet.tags
            .filter(
              (tag) => !parsedInput.tags.map((t) => t.text).includes(tag.text)
            )
            .map((tag) => ({ id: tag.id }))
        }
      } as any,
      session.user.id
    );

    revalidateTag(
      Caching.createStudyGroupTag(
        StudyGroupCacheKey.Contacts, // Using Contacts until StudySets is added to StudyGroupCacheKey
        session.user.studyGroupId
      )
    );
    revalidateTag(
      Caching.createStudyGroupTag(
        StudyGroupCacheKey.Contact, // Using Contact until StudySet is added to StudyGroupCacheKey
        session.user.studyGroupId,
        parsedInput.id
      )
    );
  });
