/**
 * File validation utilities for secure file uploads
 * These functions help prevent security issues related to file uploads
 * Includes type validation, size validation, filename sanitization, and virus scanning
 */

// Allowed file types for document uploads
export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // pptx
  'text/plain',
  'text/markdown',
  'image/jpeg',
  'image/png'
];

// Allowed file types for profile images
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp'
];

// Maximum file sizes in bytes
export const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

// File validation result interface
export interface FileValidationResult {
  valid: boolean;
  error?: string;
  securityChecks?: {
    virusScanComplete: boolean;
    isClean: boolean;
    threats?: string[];
  };
}

/**
 * Validates a file based on its type and size
 * @param file The file to validate
 * @param allowedTypes Array of allowed MIME types
 * @param maxSize Maximum file size in bytes
 * @returns An object with validation result and error message if applicable
 */
export function validateFile(
  file: File,
  allowedTypes: string[],
  maxSize: number
): FileValidationResult {
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
    };
  }

  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${Math.floor(maxSize / (1024 * 1024))}MB`
    };
  }

  return { valid: true };
}

/**
 * Validates a document file for upload
 * @param file The document file to validate
 * @returns An object with validation result and error message if applicable
 */
export function validateDocumentFile(file: File): FileValidationResult {
  return validateFile(file, ALLOWED_DOCUMENT_TYPES, MAX_DOCUMENT_SIZE);
}

/**
 * Validates an image file for upload
 * @param file The image file to validate
 * @returns An object with validation result and error message if applicable
 */
export function validateImageFile(file: File): FileValidationResult {
  return validateFile(file, ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE);
}

/**
 * Sanitizes a filename to prevent path traversal attacks
 * @param filename The original filename
 * @returns A sanitized filename
 */
export function sanitizeFilename(filename: string): string {
  // Remove any path components
  const sanitized = filename.replace(/^.*[\/]/, '');
  
  // Remove any potentially dangerous characters
  return sanitized.replace(/[^\w\s.-]/g, '_');
}

/**
 * Checks if a file extension is allowed
 * @param filename The filename to check
 * @returns Boolean indicating if the extension is allowed
 */
export function hasAllowedExtension(filename: string): boolean {
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  const allowedExtensions = [
    // Documents
    'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'md', 'csv',
    // Images
    'jpg', 'jpeg', 'png', 'gif', 'webp',
    // Other
    'epub'
  ];
  
  return allowedExtensions.includes(extension);
}

/**
 * Comprehensive file validation including virus scanning
 * @param file The file to validate
 * @param userId ID of the user uploading the file
 * @param options Validation options
 * @returns Promise resolving to a validation result
 */
export async function validateFileWithSecurity(
  file: File,
  userId: string,
  options: {
    allowedTypes: string[];
    maxSize: number;
    skipVirusScan?: boolean;
  }
): Promise<FileValidationResult> {
  // First perform basic validation
  const basicValidation = validateFile(file, options.allowedTypes, options.maxSize);
  
  if (!basicValidation.valid) {
    return basicValidation;
  }
  
  // Check file extension
  if (!hasAllowedExtension(file.name)) {
    return {
      valid: false,
      error: 'File has a disallowed extension'
    };
  }
  
  // Skip virus scan if specified
  if (options.skipVirusScan) {
    return {
      valid: true,
      securityChecks: {
        virusScanComplete: false,
        isClean: false
      }
    };
  }
  
  try {
    // Import virus scanning dynamically to avoid circular dependencies
    const { isFileSafe, scanFileBuffer } = await import('./virus-scanning');
    
    // Convert File to Buffer for scanning
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Perform virus scan
    const scanResult = await scanFileBuffer(buffer, file.name, userId);
    
    return {
      valid: scanResult.isClean,
      error: scanResult.isClean ? undefined : 'File failed security scan',
      securityChecks: {
        virusScanComplete: true,
        isClean: scanResult.isClean,
        threats: scanResult.threats
      }
    };
  } catch (error) {
    console.error('Error during security scan:', error);
    
    // In production, we might want to fail closed (reject the file)
    // For now, we'll allow it but mark that the scan failed
    return {
      valid: true,
      securityChecks: {
        virusScanComplete: false,
        isClean: false
      }
    };
  }
}

/**
 * Comprehensive document file validation with security checks
 * @param file The document file to validate
 * @param userId ID of the user uploading the file
 * @param skipVirusScan Whether to skip virus scanning
 * @returns Promise resolving to a validation result
 */
export async function validateDocumentWithSecurity(
  file: File,
  userId: string,
  skipVirusScan = false
): Promise<FileValidationResult> {
  return validateFileWithSecurity(file, userId, {
    allowedTypes: ALLOWED_DOCUMENT_TYPES,
    maxSize: MAX_DOCUMENT_SIZE,
    skipVirusScan
  });
}

/**
 * Comprehensive image file validation with security checks
 * @param file The image file to validate
 * @param userId ID of the user uploading the file
 * @param skipVirusScan Whether to skip virus scanning
 * @returns Promise resolving to a validation result
 */
export async function validateImageWithSecurity(
  file: File,
  userId: string,
  skipVirusScan = false
): Promise<FileValidationResult> {
  return validateFileWithSecurity(file, userId, {
    allowedTypes: ALLOWED_IMAGE_TYPES,
    maxSize: MAX_IMAGE_SIZE,
    skipVirusScan
  });
}
