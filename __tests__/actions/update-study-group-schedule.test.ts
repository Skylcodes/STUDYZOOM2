import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

// Mock next/cache
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

// Mock auth
jest.mock('@/lib/auth', () => ({
  dedupedAuth: jest.fn(() => Promise.resolve({
    user: { id: 'test-user-id', name: 'Test User' }
  }))
}));

// Mock prisma
const mockPrisma = {
  studyGroup: {
    findFirst: jest.fn(),
    update: jest.fn()
  }
};

jest.mock('@/lib/db/prisma', () => ({
  prisma: mockPrisma
}));

// Import the server action after mocks
import { updateStudyGroupSchedule } from '@/actions/organization/update-business-hours';

describe('updateStudyGroupSchedule', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update study group schedule successfully', async () => {
    // Mock data
    const studyGroupId = 'test-study-group-id';
    const schedule = {
      monday: [{ startTime: '09:00', endTime: '17:00' }],
      tuesday: [{ startTime: '09:00', endTime: '17:00' }],
      wednesday: [{ startTime: '09:00', endTime: '17:00' }],
      thursday: [{ startTime: '09:00', endTime: '17:00' }],
      friday: [{ startTime: '09:00', endTime: '17:00' }],
      saturday: [],
      sunday: []
    };

    // Mock findFirst to return a study group
    mockPrisma.studyGroup.findFirst.mockResolvedValue({
      id: studyGroupId,
      name: 'Test Study Group'
    });

    // Mock update to return the updated study group
    mockPrisma.studyGroup.update.mockResolvedValue({
      id: studyGroupId,
      name: 'Test Study Group',
      schedule
    });

    // Call the server action
    const result = await updateStudyGroupSchedule(studyGroupId, schedule);

    // Assertions
    expect(mockPrisma.studyGroup.findFirst).toHaveBeenCalledWith({
      where: {
        id: studyGroupId,
        members: {
          some: {
            userId: 'test-user-id',
            role: 'ADMIN'
          }
        }
      }
    });

    expect(mockPrisma.studyGroup.update).toHaveBeenCalledWith({
      where: { id: studyGroupId },
      data: { schedule }
    });

    expect(revalidatePath).toHaveBeenCalled();
    expect(result).toEqual({
      success: true,
      message: 'Study group schedule updated successfully'
    });
  });

  it('should return error when user is not authorized', async () => {
    // Mock data
    const studyGroupId = 'test-study-group-id';
    const schedule = {
      monday: [{ startTime: '09:00', endTime: '17:00' }],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    };

    // Mock findFirst to return null (user not authorized)
    mockPrisma.studyGroup.findFirst.mockResolvedValue(null);

    // Call the server action
    const result = await updateStudyGroupSchedule(studyGroupId, schedule);

    // Assertions
    expect(mockPrisma.studyGroup.findFirst).toHaveBeenCalled();
    expect(mockPrisma.studyGroup.update).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      message: 'You are not authorized to update this study group'
    });
  });

  it('should handle database errors gracefully', async () => {
    // Mock data
    const studyGroupId = 'test-study-group-id';
    const schedule = {
      monday: [{ startTime: '09:00', endTime: '17:00' }],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    };

    // Mock findFirst to return a study group
    mockPrisma.studyGroup.findFirst.mockResolvedValue({
      id: studyGroupId,
      name: 'Test Study Group'
    });

    // Mock update to throw an error
    mockPrisma.studyGroup.update.mockRejectedValue(new Error('Database error'));

    // Call the server action
    const result = await updateStudyGroupSchedule(studyGroupId, schedule);

    // Assertions
    expect(mockPrisma.studyGroup.findFirst).toHaveBeenCalled();
    expect(mockPrisma.studyGroup.update).toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      message: 'Failed to update study group schedule'
    });
  });
});
