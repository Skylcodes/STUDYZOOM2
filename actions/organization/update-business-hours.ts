'use server';

import { revalidateTag } from 'next/cache';

import { authActionClient } from '@/actions/safe-action';
import { Caching, StudyGroupCacheKey } from '@/data/caching';
import { prisma } from '@/lib/db/prisma';
import { NotFoundError } from '@/lib/validation/exceptions';
import { updateStudyGroupScheduleSchema } from '@/schemas/organization/update-business-hours-schema';

export const updateStudyGroupSchedule = authActionClient
  .metadata({ actionName: 'updateStudyGroupSchedule' })
  .schema(updateStudyGroupScheduleSchema)
  .action(async ({ parsedInput, ctx: { session } }) => {
    // Using (prisma as any) for temporary typing workarounds during transition
    const studyGroup = await (prisma as any).studyGroup.findFirst({
      where: { id: session.user.studyGroupId },
      select: {
        name: true,
        stripeCustomerId: true,
        businessHours: { // Will be renamed to schedule in future
          select: {
            id: true,
            dayOfWeek: true,
            timeSlots: {
              select: {
                id: true
              }
            }
          }
        }
      }
    });
    if (!studyGroup) {
      throw new NotFoundError('Study group not found');
    }

    // Using (prisma as any) for temporary typing workarounds during transition
    await prisma.$transaction([
      (prisma as any).workTimeSlot.deleteMany({
        where: {
          workHours: {
            studyGroup: { // Renamed from organization to studyGroup
              id: session.user.studyGroupId
            }
          },
          workHoursId: {
            in: studyGroup.businessHours.map((workHours) => workHours.id)
          }
        }
      }),
      ...parsedInput.businessHours.map((workHours) =>
        (prisma as any).workTimeSlot.createMany({
          data: workHours.timeSlots.map((timeSlot) => ({
            workHoursId: studyGroup.businessHours.find(
              (w) => w.dayOfWeek === workHours.dayOfWeek
            )!.id,
            start: timeSlot.start,
            end: timeSlot.end
          }))
        })
      )
    ]);

    revalidateTag(
      Caching.createStudyGroupTag(
        StudyGroupCacheKey.BusinessHours, // Will be renamed to StudyGroupSchedule in future
        session.user.studyGroupId
      )
    );
  });

// For backward compatibility during refactoring
export const updateBusinessHours = updateStudyGroupSchedule;
