'use server';

import { revalidateTag } from 'next/cache';

import { authActionClient } from '@/actions/safe-action';
import { Caching, StudyGroupCacheKey } from '@/data/caching';
import { prisma } from '@/lib/db/prisma';
import { addContactNoteSchema } from '@/schemas/contacts/add-contact-note-schema';

export const addContactNote = authActionClient
  .metadata({ actionName: 'addContactNote' })
  .schema(addContactNoteSchema)
  .action(async ({ parsedInput, ctx: { session } }) => {
    // Using (prisma as any) for temporary typing workarounds during transition
    await (prisma as any).studySetNote.create({
      data: {
        studySetId: parsedInput.contactId, // Using contactId for backward compatibility
        text: parsedInput.text ? parsedInput.text : undefined,
        userId: session.user.id
      },
      select: {
        id: true // SELECT NONE
      }
    });

    revalidateTag(
      Caching.createStudyGroupTag(
        StudyGroupCacheKey.ContactNotes, // Using ContactNotes until StudySetNotes is added to StudyGroupCacheKey
        session.user.studyGroupId,
        parsedInput.contactId // Using contactId for backward compatibility
      )
    );
  });
