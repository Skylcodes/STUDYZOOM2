'use server';

import { revalidatePath } from 'next/cache';

import { prisma } from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/session';

// Simple validation helper
function validateInput(input: any): { valid: boolean; id?: string; error?: string } {
  if (!input || typeof input.id !== 'string') {
    return { valid: false, error: 'Invalid input: missing or invalid id' };
  }
  return { valid: true, id: input.id };
}

/**
 * Add a study set to favorites
 * This is a temporary implementation that uses existing models
 */
export async function addFavorite(input: { id: string }) {
  // Validate the input
  const validation = validateInput(input);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }
  
  const id = validation.id!;
  
  // Get the current user
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: 'Authentication required' };
  }
  
  try {
    // Check if the study set exists
    const studySet = await prisma.studySet.findUnique({
      where: { id }
    });
    
    if (!studySet) {
      return { success: false, error: 'Study set not found' };
    }
    
    // For now, we'll simply update the study set's notes field to include a favorite marker
    // This is a temporary solution until a proper favorites table is implemented
    const notes = studySet.notes || '';
    const favoriteMarker = '[FAVORITE]';
    
    if (!notes.includes(favoriteMarker)) {
      await prisma.studySet.update({
        where: { id },
        data: {
          notes: `${favoriteMarker} ${notes}`.trim()
        }
      });
    }
    
    // Revalidate paths
    revalidatePath('/dashboard');
    revalidatePath(`/dashboard/study-sets/${id}`);
    
    return { success: true };
  } catch (error) {
    console.error('Error adding favorite:', error);
    return { success: false, error: 'Failed to add to favorites' };
  }
}
