import { mapSubscriptionToTier } from '@/lib/billing/map-subscription-to-tier';
import { pickSubscription } from '@/lib/billing/pick-subscription';
import { stripeServer } from '@/lib/billing/stripe-server';
import { prisma } from '@/lib/db/prisma';
import type { Maybe } from '@/types/maybe';

// Domain-aligned function for updating study group subscription plan
export async function updateStudyGroupSubscriptionPlan(
  stripeCustomerId: Maybe<string>
): Promise<void> {
  if (!stripeCustomerId) {
    return;
  }
  const organization = await (prisma as any).studyGroup.findFirst({
    where: { stripeCustomerId },
    select: {
      id: true,
      tier: true,
      stripeCustomerId: true
    }
  });
  if (!organization || !organization.stripeCustomerId) {
    return;
  }

  const subscriptionsResponse = await stripeServer.subscriptions.list({
    customer: organization.stripeCustomerId
  });

  const subscriptions = subscriptionsResponse.data || [];
  const subscription = pickSubscription(subscriptions);
  const tier = mapSubscriptionToTier(subscription);

  if (tier !== organization.tier) {
    await (prisma as any).studyGroup.update({
      where: { id: organization.id },
      data: { tier }
    });
  }
}

// For backward compatibility during refactoring
export const updateOrganizationSubscriptionPlan = updateStudyGroupSubscriptionPlan;
