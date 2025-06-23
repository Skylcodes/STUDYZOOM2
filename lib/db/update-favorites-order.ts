import { prisma } from '@/lib/db/prisma';

/**
 * Updates the order of favorites after removing one
 * This ensures that favorites maintain a continuous sequence of order values
 * @param userId The user ID whose favorites need reordering
 */
export async function updateFavoritesOrder(userId: string): Promise<void> {
  // Get all remaining favorites for the user
  const favorites = await prisma.favorite.findMany({
    where: {
      userId
    },
    orderBy: {
      order: 'asc'
    }
  });

  // Update each favorite with a new sequential order
  const updatePromises = favorites.map((favorite, index) => {
    return prisma.favorite.update({
      where: {
        id: favorite.id
      },
      data: {
        order: index + 1
      }
    });
  });

  // Execute all updates in parallel
  await Promise.all(updatePromises);
}
