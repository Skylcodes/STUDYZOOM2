/**
 * This file provides type information for the Prisma client extensions.
 * 
 * NOTE: We no longer need to manually extend the PrismaClient types here
 * because the Prisma schema has been updated with the new model names,
 * and the Prisma client has been regenerated with proper TypeScript types.
 * 
 * This file is kept for documentation purposes and to provide backward
 * compatibility information for developers.
 */

import { PrismaClient } from '@prisma/client';

/**
 * Model Renaming Guide:
 * 
 * Legacy Model Name -> New Domain-Aligned Name
 * -----------------------------------------
 * Organization -> StudyGroup
 * Invitation -> StudyGroupInvite
 * Contact -> StudySet
 * ContactTask -> ActionItem
 * ContactTag -> TopicTag
 * 
 * When using the Prisma client, you can now use the new model names directly:
 * 
 * Example:
 * ```
 * // Old way
 * const organizations = await prisma.organization.findMany();
 * 
 * // New way
 * const studyGroups = await prisma.studyGroup.findMany();
 * ```
 * 
 * For backward compatibility, you can still use the old model names
 * by casting the prisma client to any:
 * 
 * ```
 * // Backward compatibility
 * const organizations = await (prisma as any).organization.findMany();
 * ```
 */

// No type extensions needed - Prisma client already includes the new model types
