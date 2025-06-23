'use server';

import { revalidateTag } from 'next/cache';

import { authActionClient } from '@/actions/safe-action';
import { Caching, StudyGroupCacheKey } from '@/data/caching';
import { prisma } from '@/lib/db/prisma';
import { NotFoundError } from '@/lib/validation/exceptions';
import { deleteContactNoteSchema } from '@/schemas/contacts/delete-contact-note-schema';

export const deleteContactNote = authActionClient
  .metadata({ actionName: 'deleteContactNote' })
  .schema(deleteContactNoteSchema)
  .action(async ({ parsedInput, ctx: { session } }) => {
    // Using (prisma as any) for temporary typing workarounds during transition
    const count = await (prisma as any).studySetNote.count({
      where: {
        id: parsedInput.id,
        studySet: {
          studyGroupId: session.user.studyGroupId
        }
      }
    });
    if (count < 1) {
      throw new NotFoundError('Study set note not found');
    }

    // Using (prisma as any) for temporary typing workarounds during transition
    const note = await (prisma as any).studySetNote.delete({
      where: { id: parsedInput.id },
      select: { studySetId: true }
    });

    revalidateTag(
      Caching.createStudyGroupTag(
        StudyGroupCacheKey.ContactNotes, // Using ContactNotes until StudySetNotes is added to StudyGroupCacheKey
        session.user.studyGroupId,
        note.studySetId // Using studySetId from the domain model
      )
    );
  });
