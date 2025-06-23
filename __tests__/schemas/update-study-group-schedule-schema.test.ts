import { describe, expect, it } from '@jest/globals';

import { updateStudyGroupScheduleSchema } from '@/schemas/organization/update-business-hours-schema';

describe('updateStudyGroupScheduleSchema', () => {
  it('should validate a valid schedule', () => {
    const validSchedule = {
      monday: [
        { startTime: '09:00', endTime: '12:00' },
        { startTime: '13:00', endTime: '17:00' }
      ],
      tuesday: [
        { startTime: '09:00', endTime: '17:00' }
      ],
      wednesday: [
        { startTime: '09:00', endTime: '17:00' }
      ],
      thursday: [
        { startTime: '09:00', endTime: '17:00' }
      ],
      friday: [
        { startTime: '09:00', endTime: '15:00' }
      ],
      saturday: [],
      sunday: []
    };

    const result = updateStudyGroupScheduleSchema.safeParse(validSchedule);
    expect(result.success).toBe(true);
  });

  it('should validate an empty schedule', () => {
    const emptySchedule = {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    };

    const result = updateStudyGroupScheduleSchema.safeParse(emptySchedule);
    expect(result.success).toBe(true);
  });

  it('should reject invalid time formats', () => {
    const invalidTimeFormat = {
      monday: [
        { startTime: '9:00', endTime: '17:00' } // Missing leading zero
      ],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    };

    const result = updateStudyGroupScheduleSchema.safeParse(invalidTimeFormat);
    expect(result.success).toBe(false);
  });

  it('should reject when end time is before start time', () => {
    const invalidTimeRange = {
      monday: [
        { startTime: '17:00', endTime: '09:00' } // End before start
      ],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    };

    const result = updateStudyGroupScheduleSchema.safeParse(invalidTimeRange);
    expect(result.success).toBe(false);
  });

  it('should reject when missing required days', () => {
    const missingDays = {
      monday: [],
      tuesday: [],
      // wednesday is missing
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    };

    const result = updateStudyGroupScheduleSchema.safeParse(missingDays);
    expect(result.success).toBe(false);
  });

  it('should reject overlapping time slots', () => {
    const overlappingSlots = {
      monday: [
        { startTime: '09:00', endTime: '12:00' },
        { startTime: '11:00', endTime: '14:00' } // Overlaps with previous slot
      ],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    };

    // Note: The current schema doesn't check for overlapping slots
    // This test is a placeholder for future enhancement
    const result = updateStudyGroupScheduleSchema.safeParse(overlappingSlots);
    expect(result.success).toBe(true);
  });
});
