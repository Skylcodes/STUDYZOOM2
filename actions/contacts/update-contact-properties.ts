'use server';

import { revalidateTag } from 'next/cache';

import { authActionClient } from '@/actions/safe-action';
import { Caching, StudyGroupCacheKey, UserCacheKey } from '@/data/caching';
import { updateContactAndCaptureEvent } from '@/lib/db/contact-event-capture';
import { prisma } from '@/lib/db/prisma';
import { NotFoundError } from '@/lib/validation/exceptions';
import { updateContactPropertiesSchema } from '@/schemas/contacts/update-contact-properties-schema';

export const updateContactProperties = authActionClient
  .metadata({ actionName: 'updateContactProperties' })
  .schema(updateContactPropertiesSchema)
  .action(async ({ parsedInput, ctx: { session } }) => {
    // Using (prisma as any) for temporary typing workarounds during transition
    const count = await (prisma as any).studySet.count({
      where: {
        studyGroupId: session.user.studyGroupId,
        id: parsedInput.id
      }
    });
    if (count < 1) {
      throw new NotFoundError('Study set not found');
    }

    // Using type assertion to maintain backward compatibility during transition
    // The updateContactAndCaptureEvent function is already updated to work with StudySet model
    await updateContactAndCaptureEvent(
      parsedInput.id,
      {
        record: parsedInput.record, // Keep using record instead of recordType for backward compatibility
        name: parsedInput.name, // Keep using name instead of title for backward compatibility
        email: parsedInput.email,
        address: parsedInput.address,
        phone: parsedInput.phone
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
    revalidateTag(
      Caching.createUserTag(UserCacheKey.Favorites, session.user.id)
    );
  });
