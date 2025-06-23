import { updateStudyGroupDetails } from '@/actions/organization/update-organization-details';
import { revalidateTag } from 'next/cache';
import { auth } from 'next-auth';

// Mock dependencies
jest.mock('next/cache', () => ({
  revalidateTag: jest.fn()
}));

jest.mock('next-auth', () => ({
  auth: jest.fn()
}));

jest.mock('@/lib/db/prisma', () => ({
  prisma: {
    studyGroup: {
      update: jest.fn()
    }
  }
}));

// Import the mocked prisma
import { prisma } from '@/lib/db/prisma';

describe('updateStudyGroupDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock auth to return a user with studyGroupId
    (auth as jest.Mock).mockResolvedValue({
      user: {
        id: 'user-id-1',
        studyGroupId: 'study-group-id-1'
      }
    });
    
    // Mock prisma update to return success
    (prisma.studyGroup.update as jest.Mock).mockResolvedValue({
      id: 'study-group-id-1',
      name: 'Updated Study Group',
      description: 'Updated description'
    });
  });

  it('should update study group details successfully', async () => {
    const formData = {
      name: 'Updated Study Group',
      description: 'Updated description'
    };

    const result = await updateStudyGroupDetails(formData);

    // Check that prisma was called with correct parameters
    expect(prisma.studyGroup.update).toHaveBeenCalledWith({
      where: { id: 'study-group-id-1' },
      data: formData
    });

    // Check that cache was revalidated
    expect(revalidateTag).toHaveBeenCalled();

    // Check return value
    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      id: 'study-group-id-1',
      name: 'Updated Study Group',
      description: 'Updated description'
    });
  });

  it('should return error when user is not authenticated', async () => {
    // Mock auth to return null (unauthenticated)
    (auth as jest.Mock).mockResolvedValue({ user: null });

    const formData = {
      name: 'Updated Study Group',
      description: 'Updated description'
    };

    const result = await updateStudyGroupDetails(formData);

    // Check that prisma was not called
    expect(prisma.studyGroup.update).not.toHaveBeenCalled();

    // Check return value
    expect(result.success).toBe(false);
    expect(result.error).toBe('Unauthorized');
  });

  it('should return error when user has no study group', async () => {
    // Mock auth to return a user without studyGroupId
    (auth as jest.Mock).mockResolvedValue({
      user: {
        id: 'user-id-1',
        studyGroupId: null
      }
    });

    const formData = {
      name: 'Updated Study Group',
      description: 'Updated description'
    };

    const result = await updateStudyGroupDetails(formData);

    // Check that prisma was not called
    expect(prisma.studyGroup.update).not.toHaveBeenCalled();

    // Check return value
    expect(result.success).toBe(false);
    expect(result.error).toBe('Study group not found');
  });

  it('should handle database errors gracefully', async () => {
    // Mock prisma to throw an error
    (prisma.studyGroup.update as jest.Mock).mockRejectedValue(new Error('Database error'));

    const formData = {
      name: 'Updated Study Group',
      description: 'Updated description'
    };

    const result = await updateStudyGroupDetails(formData);

    // Check return value
    expect(result.success).toBe(false);
    expect(result.error).toBe('Failed to update study group details');
  });
});
