'use server';

import { revalidateTag } from 'next/cache';

import { authActionClient } from '@/actions/safe-action';
import { Caching, StudyGroupCacheKey } from '@/data/caching';
import { stripeServer } from '@/lib/billing/stripe-server';
import { prisma } from '@/lib/db/prisma';
import { NotFoundError } from '@/lib/validation/exceptions';
import { updateStudyGroupDetailsSchema } from '@/schemas/organization/update-organization-details-schema';

export const updateStudyGroupDetails = authActionClient
  .metadata({ actionName: 'updateStudyGroupDetails' })
  .schema(updateStudyGroupDetailsSchema)
  .action(async ({ parsedInput, ctx: { session } }) => {
    // Using (prisma as any) for temporary typing workarounds during transition
    const studyGroup = await (prisma as any).studyGroup.findFirst({
      where: { id: session.user.studyGroupId },
      select: {
        name: true,
        stripeCustomerId: true
      }
    });
    if (!studyGroup) {
      throw new NotFoundError('Study group not found');
    }

    // Using (prisma as any) for temporary typing workarounds during transition
    await (prisma as any).studyGroup.update({
      where: { id: session.user.studyGroupId },
      data: {
        name: parsedInput.name,
        address: parsedInput.address,
        phone: parsedInput.phone,
        email: parsedInput.email,
        website: parsedInput.website
      },
      select: {
        id: true // SELECT NONE
      }
    });

    if (studyGroup.name !== parsedInput.name) {
      if (studyGroup.stripeCustomerId) {
        try {
          await stripeServer.customers.update(studyGroup.stripeCustomerId, {
            name: parsedInput.name
          });
        } catch (e) {
          console.error(e);
        }
      } else {
        console.warn('Stripe customer ID is missing');
      }
    }

    revalidateTag(
      Caching.createStudyGroupTag(
        StudyGroupCacheKey.OrganizationDetails, // Using OrganizationDetails until StudyGroupDetails is added to StudyGroupCacheKey
        session.user.studyGroupId
      )
    );
  });

// For backward compatibility during refactoring
export const updateOrganizationDetails = updateStudyGroupDetails;
