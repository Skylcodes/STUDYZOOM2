'use server';

import { revalidatePath } from 'next/cache';
import { createHash } from 'crypto';
import { z } from 'zod';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import logger, { LogCategory } from '@/lib/logging/application-logger';
import { createError, ErrorType, ErrorCode, handleError } from '@/lib/error/error-handler';
import { validateDocumentWithSecurity, validateImageWithSecurity } from '@/lib/security/file-validation';
import { verifyResourceOwnership } from '@/lib/security/security-audit';
import { FileUploadAction } from '@/types/file-upload-action';

/**
 * Type for file upload result
 */
export interface FileUploadResult {
  success: boolean;
  error?: string;
  message?: string;
  fileUrl?: string;
  fileHash?: string;
}

/**
 * Calculate SHA-256 hash of a file buffer
 * @param buffer File buffer to hash
 * @returns SHA-256 hash as hex string
 */
function calculateFileHash(buffer: Buffer): string {
  return createHash('sha256').update(buffer).digest('hex');
}

/**
 * Secure file upload handler for user profile images
 * @param formData Form data containing the file to upload
 * @returns Upload result
 */
export async function secureUserImageUpload(formData: FormData): Promise<FileUploadResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  const userId = session.user.id;
  const action = formData.get('action') as FileUploadAction;
  
  // Handle image deletion
  if (action === FileUploadAction.Delete) {
    try {
      await prisma.userImage.delete({
        where: { id: userId } // Using id as the primary key
      });
      
      revalidatePath('/dashboard/settings/account');
      return { success: true };
    } catch (error) {
      console.error('Error deleting user image:', error);
      return { success: false, error: 'Failed to delete image' };
    }
  }
  
  // Handle image upload/update
  if (action === FileUploadAction.Update) {
    const file = formData.get('file') as File;
    if (!file) {
      return { success: false, error: 'No file provided' };
    }
    
    try {
      // Validate file with security checks
      const validationResult = await validateImageWithSecurity(file, userId);
      if (!validationResult.valid) {
        return { success: false, error: validationResult.error || 'Invalid file' };
      }
      
      // If security checks failed, reject the file
      if (validationResult.securityChecks?.virusScanComplete && !validationResult.securityChecks.isClean) {
        return { 
          success: false, 
          error: `File failed security scan: ${validationResult.securityChecks.threats?.join(', ')}` 
        };
      }
      
      // Process the file
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const hash = calculateFileHash(buffer);
      
      // Update or create user image
      await prisma.userImage.upsert({
        where: { id: userId }, // Using id as the primary key
        update: {
          data: buffer,
          contentType: file.type,
          hash
        },
        create: {
          id: userId, // Using id as the primary key
          userId,
          data: buffer,
          contentType: file.type,
          hash
        }
      });
      
      revalidatePath('/dashboard/settings/account');
      return { 
        success: true, 
        fileUrl: `/api/user-images/${userId}?v=${hash}`,
        fileHash: hash
      };
    } catch (error) {
      console.error('Error uploading user image:', error);
      return { success: false, error: 'Failed to upload image' };
    }
  }
  
  return { success: false, error: 'Invalid action' };
}

/**
 * Secure file upload handler for contact/study set images
 * @param formData Form data containing the file to upload
 * @returns Upload result
 */
export async function secureContactImageUpload(formData: FormData): Promise<FileUploadResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  const userId = session.user.id;
  const contactId = formData.get('contactId') as string;
  const action = formData.get('action') as FileUploadAction;
  
  // Verify ownership of the contact/study set
  const ownershipVerified = await verifyResourceOwnership(
    userId,
    'contact',
    contactId,
    'update_contact_image'
  );
  
  if (!ownershipVerified) {
    return { success: false, error: 'Unauthorized access to resource' };
  }
  
  // Handle image deletion
  if (action === FileUploadAction.Delete) {
    try {
      // Use type assertion to bypass TypeScript error
      await (prisma as any).contactImage.delete({
        where: { contactId }
      });
      
      // Log successful deletion
      logger.info(LogCategory.FILE, 'Contact image deleted', {
        userId: session.user.id,
        data: { contactId }
      });
      
      // Revalidate the contact page to show the updated image
      revalidatePath(`/dashboard/contacts/${contactId}`);
      
      return {
        success: true,
        message: 'Contact image deleted successfully'
      };
    } catch (error) {
      // Log error
      logger.error(LogCategory.FILE, 'Error deleting contact image', {
        userId: session.user.id,
        data: { contactId },
        error: error instanceof Error ? error : new Error(String(error))
      });
      
      return {
        success: false,
        error: 'Failed to delete contact image'
      };
    }
  }
  
  // Handle image upload/update
  if (action === FileUploadAction.Update && contactId) {
    const file = formData.get('file') as File;
    if (!file) {
      return { success: false, error: 'No file provided' };
    }
    
    try {
      // Validate the file with security checks
      const validationResult = await validateImageWithSecurity(file, session.user.id);
      
      if (!validationResult.valid) {
        // Log validation error
        logger.warn(LogCategory.SECURITY, 'Contact image validation failed', {
          userId: session.user.id,
          data: { contactId, fileType: file.type },
          error: new Error(validationResult.error || 'Unknown validation error')
        });
        
        return { success: false, error: validationResult.error || 'Invalid file' };
      }
      
      // If security checks failed, reject the file
      if (validationResult.securityChecks?.virusScanComplete && !validationResult.securityChecks.isClean) {
        // Log security issue
        logger.warn(LogCategory.SECURITY, 'Contact image security check failed', {
          userId: session.user.id,
          data: { 
            contactId, 
            fileType: file.type,
            threats: validationResult.securityChecks.threats 
          },
          error: new Error('File failed security scan')
        });
        
        return { 
          success: false, 
          error: `File failed security scan: ${validationResult.securityChecks.threats?.join(', ')}` 
        };
      }
      
      // Process the file
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const hash = calculateFileHash(buffer);
      
      // Update or create contact image using type assertion
      const contactImage = await (prisma as any).contactImage.upsert({
        where: {
          contactId: contactId
        },
        update: {
          data: buffer,
          contentType: file.type,
          hash: hash,
          updatedAt: new Date()
        },
        create: {
          contactId: contactId,
          data: buffer,
          contentType: file.type,
          hash: hash
        }
      });
      
      // Log successful upload
      logger.info(LogCategory.FILE, 'Contact image uploaded', {
        userId: session.user.id,
        data: { contactId, fileHash: hash, fileType: file.type, fileSize: buffer.length }
      });
      
      // Revalidate the contact page to show the updated image
      revalidatePath(`/dashboard/contacts/${contactId}`);
      
      return {
        success: true,
        message: 'Contact image uploaded successfully',
        fileHash: hash,
        fileUrl: `/api/contacts/${contactId}/image?v=${hash}`
      };
    } catch (error) {
      // Log error
      logger.error(LogCategory.FILE, 'Error processing contact image', {
        userId: session.user.id,
        data: { contactId, fileType: file.type },
        error: error instanceof Error ? error : new Error(String(error))
      });
      
      return { 
        success: false, 
        error: 'Failed to process image' 
      };
    }
  }
  
  return { success: false, error: 'Invalid action' };
}

/**
 * Secure file upload handler for study materials (documents)
 * @param formData Form data containing the file to upload
 * @returns Upload result
 */
export async function secureStudyMaterialUpload(formData: FormData): Promise<FileUploadResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  const userId = session.user.id;
  const studySetId = formData.get('studySetId') as string;
  const materialId = formData.get('materialId') as string;
  
  // Verify ownership of the study set
  const ownershipVerified = await verifyResourceOwnership(
    userId,
    'studySet',
    studySetId,
    'upload_study_material'
  );
  
  if (!ownershipVerified) {
    // Log unauthorized access attempt
    logger.warn(LogCategory.SECURITY, 'Unauthorized study material upload attempt', {
      userId,
      data: { studySetId }
    });
    return { success: false, error: 'Unauthorized access to resource' };
  }
  
  // Handle study material upload
  if (studySetId) {
    const file = formData.get('file') as File;
    if (!file) {
      return { success: false, error: 'No file provided' };
    }
    
    try {
      // Validate the file with security checks
      const validationResult = await validateDocumentWithSecurity(file, session.user.id);
      if (!validationResult.valid) {
        // Log validation error
        logger.warn(LogCategory.SECURITY, 'Study material validation failed', {
          userId: session.user.id,
          data: { studySetId, fileType: file.type },
          error: new Error(validationResult.error || 'Unknown validation error')
        });
        
        return { success: false, error: validationResult.error || 'Invalid file' };
      }
      
      // If security checks failed, reject the file
      if (validationResult.securityChecks?.virusScanComplete && !validationResult.securityChecks.isClean) {
        // Log security issue
        logger.warn(LogCategory.SECURITY, 'Study material security check failed', {
          userId: session.user.id,
          data: { 
            studySetId, 
            fileType: file.type,
            threats: validationResult.securityChecks.threats 
          },
          error: new Error('File failed security scan')
        });
        
        return { 
          success: false, 
          error: `File failed security scan: ${validationResult.securityChecks.threats?.join(', ')}` 
        };
      }
      
      // Process the file
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const hash = calculateFileHash(buffer);
    
      // Store the document in the database
      // Note: In a production environment, you might want to store large files in S3 or similar
      const studyMaterial = await prisma.studyMaterial.upsert({
        where: {
          id: materialId || '00000000-0000-0000-0000-000000000000' // Use a dummy ID for new materials
        },
        update: {
          fileName: file.name,
          fileSize: file.size,
          contentType: file.type,
          data: buffer,
          hash: hash,
          updatedAt: new Date()
        },
        create: {
          id: materialId || undefined,
          studySetId: studySetId,
          fileName: file.name,
          fileSize: file.size,
          contentType: file.type,
          data: buffer,
          hash: hash
        }
      });
      
      // Log successful upload
      logger.info(LogCategory.FILE, 'Study material uploaded', {
        userId: session.user.id,
        data: { 
          studySetId, 
          materialId: studyMaterial.id, 
          fileHash: hash, 
          fileType: file.type, 
          fileSize: buffer.length 
        }
      });
    
      // Revalidate the study set page
      revalidatePath(`/study-sets/${studySetId}`);
    
      return {
        success: true,
        message: 'Study material uploaded successfully',
        fileHash: hash,
        fileUrl: `/api/study-materials/${studyMaterial.id}?v=${hash}`
      };
    } catch (error) {
      // Log error
      logger.error(LogCategory.FILE, 'Error uploading study material', {
        userId: session.user.id,
        data: { studySetId, fileType: file.type, fileName: file.name },
        error: error instanceof Error ? error : new Error(String(error))
      });
      
      return { 
        success: false, 
        error: 'Failed to upload study material' 
      };
    }
  }
  
  return { success: false, error: 'Invalid action' };
}
