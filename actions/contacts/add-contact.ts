'use server';

import { revalidateTag } from 'next/cache';

import { authActionClient } from '@/actions/safe-action';
import { Caching, StudyGroupCacheKey, UserCacheKey } from '@/data/caching';
import { createContactAndCaptureEvent } from '@/lib/db/contact-event-capture';
import { addContactSchema } from '@/schemas/contacts/add-contact-schema';

export const addContact = authActionClient
  .metadata({ actionName: 'addContact' })
  .schema(addContactSchema)
  .action(async ({ parsedInput, ctx: { session } }) => {
    // Using createContactAndCaptureEvent with domain-aligned property names
    // Type assertion is needed during transition phase
    await createContactAndCaptureEvent(
      {
        record: parsedInput.record, // Keep using record instead of recordType for backward compatibility
        name: parsedInput.name, // Keep using name instead of title for backward compatibility
        email: parsedInput.email,
        phone: parsedInput.phone,
        organization: { // Keep using organization instead of studyGroup for backward compatibility
          connect: {
            id: session.user.studyGroupId // Use studyGroupId (new field) instead of organizationId
          }
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
      Caching.createUserTag(UserCacheKey.Favorites, session.user.id)
    );
  });
