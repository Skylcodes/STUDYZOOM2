/**
 * Virus scanning utilities for StudyZoom
 * These functions help protect against malicious file uploads
 */

import { createHash } from 'crypto';
import { logSecurityAudit } from './security-audit';

// Interface for virus scanning results
interface VirusScanResult {
  isClean: boolean;
  threats: string[];
  scanId: string;
  fileName: string;
  fileSize: number;
  fileHash: string;
  timestamp: Date;
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
 * Check if a file is potentially malicious based on its magic bytes
 * This is a basic implementation and should be replaced with a proper virus scanning service in production
 * @param buffer File buffer to check
 * @returns Array of potential threats
 */
function checkMagicBytes(buffer: Buffer): string[] {
  const threats: string[] = [];
  
  // Check for executable files
  const exeSignatures = [
    { bytes: [0x4D, 0x5A], name: 'Windows Executable (MZ)' },
    { bytes: [0x7F, 0x45, 0x4C, 0x46], name: 'ELF File' },
    { bytes: [0xCA, 0xFE, 0xBA, 0xBE], name: 'Java Class File' },
    { bytes: [0xCF, 0xFA, 0xED, 0xFE], name: 'Mach-O Binary (macOS)' }
  ];
  
  for (const sig of exeSignatures) {
    if (buffer.length >= sig.bytes.length) {
      let match = true;
      for (let i = 0; i < sig.bytes.length; i++) {
        if (buffer[i] !== sig.bytes[i]) {
          match = false;
          break;
        }
      }
      if (match) {
        threats.push(sig.name);
      }
    }
  }
  
  // Check for script files in PDFs (potential JavaScript exploits)
  if (buffer.includes(Buffer.from('/JS')) && buffer.includes(Buffer.from('/JavaScript'))) {
    threats.push('PDF with JavaScript');
  }
  
  // Check for macros in Office documents
  if (buffer.includes(Buffer.from('vbaProject.bin'))) {
    threats.push('Office Document with Macros');
  }
  
  return threats;
}

/**
 * Scan a file buffer for viruses and malware
 * In production, this should be replaced with a call to a proper virus scanning service
 * @param buffer File buffer to scan
 * @param fileName Original file name
 * @param userId ID of the user who uploaded the file
 * @returns Virus scan result
 */
export async function scanFileBuffer(
  buffer: Buffer,
  fileName: string,
  userId: string
): Promise<VirusScanResult> {
  // Generate a scan ID for tracking
  const scanId = `scan_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  
  // Calculate file hash
  const fileHash = calculateFileHash(buffer);
  
  // In a production environment, we would call an external virus scanning service here
  // For now, we'll use a basic check of magic bytes and file extensions
  const threats = checkMagicBytes(buffer);
  
  // Check file extension for potentially dangerous types
  const dangerousExtensions = ['.exe', '.dll', '.bat', '.cmd', '.ps1', '.vbs', '.js', '.jar'];
  const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
  
  if (dangerousExtensions.includes(fileExtension)) {
    threats.push(`Potentially dangerous file extension: ${fileExtension}`);
  }
  
  // Create scan result
  const result: VirusScanResult = {
    isClean: threats.length === 0,
    threats,
    scanId,
    fileName,
    fileSize: buffer.length,
    fileHash,
    timestamp: new Date()
  };
  
  // Log the scan for security audit
  await logSecurityAudit(
    userId,
    'virus_scan',
    'file',
    scanId,
    result.isClean,
    {
      fileName,
      fileSize: buffer.length,
      fileHash,
      threats: result.threats
    }
  );
  
  return result;
}

/**
 * Check if a file is safe to store and process
 * @param buffer File buffer to check
 * @param fileName Original file name
 * @param userId ID of the user who uploaded the file
 * @returns Boolean indicating if the file is safe
 */
export async function isFileSafe(
  buffer: Buffer,
  fileName: string,
  userId: string
): Promise<boolean> {
  const scanResult = await scanFileBuffer(buffer, fileName, userId);
  return scanResult.isClean;
}

/**
 * Get a list of allowed file extensions for StudyZoom
 * @returns Array of allowed file extensions
 */
export function getAllowedFileExtensions(): string[] {
  return [
    // Documents
    '.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx',
    // Images
    '.jpg', '.jpeg', '.png', '.gif', '.webp',
    // Text
    '.txt', '.md', '.csv',
    // Other
    '.epub'
  ];
}
