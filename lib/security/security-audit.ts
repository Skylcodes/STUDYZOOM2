/**
 * Security audit utilities for StudyZoom
 * These functions help identify and prevent security issues
 */

import { Session } from 'next-auth';
import { prisma } from '@/lib/db/prisma';

/**
 * Logs security audit events for monitoring and analysis
 * @param userId User ID performing the action
 * @param action Action being performed
 * @param resourceType Type of resource being accessed
 * @param resourceId ID of the resource being accessed
 * @param success Whether the access was successful
 * @param details Additional details about the access attempt
 */
export async function logSecurityAudit(
  userId: string,
  action: string,
  resourceType: string,
  resourceId: string,
  success: boolean,
  details?: Record<string, any>
) {
  try {
    await prisma.securityAuditLog.create({
      data: {
        userId,
        action,
        resourceType,
        resourceId,
        success,
        details: details ? JSON.stringify(details) : null,
        timestamp: new Date()
      }
    });
  } catch (error) {
    // Log to console in development, but don't fail if audit logging fails
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to log security audit:', error);
    }
  }
}

/**
 * Verifies ownership of a resource and logs the attempt
 * @param session Current user session
 * @param resourceType Type of resource to verify
 * @param resourceId ID of the resource to verify
 * @param action Action being performed
 * @returns Boolean indicating whether the user owns the resource
 */
export async function verifyAndLogResourceAccess(
  session: Session | null,
  resourceType: string,
  resourceId: string,
  action: string
): Promise<boolean> {
  if (!session?.user?.id) {
    return false;
  }

  const userId = session.user.id;
  let success = false;
  let resource = null;

  try {
    switch (resourceType) {
      case 'document':
      case 'studySet': // Support both legacy and new domain-aligned names
        resource = await prisma.studySet.findUnique({
          where: {
            id: resourceId,
            userId
          }
        });
        break;
      case 'flashcardSet':
        // Flashcard sets are stored in the studySet.flashcards JSON field
        // We need to check if the user owns the study set that contains the flashcard set
        resource = await prisma.studySet.findFirst({
          where: {
            id: resourceId,
            userId
          }
        });
        break;
      case 'quiz':
        // Quizzes are stored in the studySet.quiz JSON field
        // We need to check if the user owns the study set that contains the quiz
        resource = await prisma.studySet.findFirst({
          where: {
            id: resourceId,
            userId
          }
        });
        break;
      case 'studyGroup':
        // Check if the user is a member of the study group
        // Since we don't have a direct studyGroupMember model, we check through the relation
        resource = await prisma.studyGroup.findFirst({
          where: {
            id: resourceId,
            members: {
              some: {
                id: userId
              }
            }
          }
        });
        break;
      default:
        break;
    }

    success = !!resource;

    // Log the access attempt
    await logSecurityAudit(
      userId,
      action,
      resourceType,
      resourceId,
      success,
      { resourceExists: !!resource }
    );

    return success;
  } catch (error) {
    // Log the error
    await logSecurityAudit(
      userId,
      action,
      resourceType,
      resourceId,
      false,
      { error: (error as Error).message }
    );
    return false;
  }
}

/**
 * Runs a security audit on the database to identify potential security issues
 * This is intended to be run as a scheduled job or manually by administrators
 */
/**
 * Verifies if a user owns a specific resource
 * @param userId User ID to check ownership for
 * @param resourceType Type of resource to verify
 * @param resourceId ID of the resource to verify
 * @param action Action being performed (for audit logging)
 * @returns Boolean indicating whether the user owns the resource
 */
export async function verifyResourceOwnership(
  userId: string,
  resourceType: string,
  resourceId: string,
  action: string
): Promise<boolean> {
  if (!userId || !resourceId) {
    return false;
  }

  let success = false;
  let resource = null;

  try {
    switch (resourceType) {
      case 'document':
      case 'studySet': // Support both legacy and new domain-aligned names
        resource = await prisma.studySet.findFirst({
          where: {
            id: resourceId,
            userId
          }
        });
        break;
      case 'contact':
        // Check if the user owns the contact
        resource = await prisma.contact.findFirst({
          where: {
            id: resourceId,
            userId
          }
        });
        break;
      case 'flashcardSet':
        // Flashcard sets are stored in the studySet.flashcards JSON field
        resource = await prisma.studySet.findFirst({
          where: {
            id: resourceId,
            userId
          }
        });
        break;
      case 'quiz':
        // Quizzes are stored in the studySet.quiz JSON field
        resource = await prisma.studySet.findFirst({
          where: {
            id: resourceId,
            userId
          }
        });
        break;
      case 'studyGroup':
        // Check if the user is a member of the study group
        resource = await prisma.studyGroup.findFirst({
          where: {
            id: resourceId,
            members: {
              some: {
                id: userId
              }
            }
          }
        });
        break;
      default:
        break;
    }

    success = !!resource;

    // Log the access attempt
    await logSecurityAudit(
      userId,
      action,
      resourceType,
      resourceId,
      success,
      { resourceExists: !!resource }
    );

    return success;
  } catch (error) {
    // Log the error
    await logSecurityAudit(
      userId,
      action,
      resourceType,
      resourceId,
      false,
      { error: (error as Error).message }
    );
    return false;
  }
}

export async function runSecurityAudit() {
  const auditResults = {
    orphanedResources: 0,
    missingOwnership: 0,
    suspiciousActivity: 0
  };

  // Check for orphaned resources (resources without proper ownership)
  const orphanedStudySets = await prisma.studySet.findMany({
    where: {
      userId: null
    }
  });
  auditResults.orphanedResources += orphanedStudySets.length;

  // Check for suspicious activity (multiple failed access attempts)
  const suspiciousActivity = await prisma.securityAuditLog.groupBy({
    by: ['userId', 'resourceId'],
    _count: {
      id: true
    },
    where: {
      success: false,
      timestamp: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
      }
    },
    having: {
      id: {
        _count: {
          gt: 5 // More than 5 failed attempts
        }
      }
    }
  });
  auditResults.suspiciousActivity = suspiciousActivity.length;

  return auditResults;
}
