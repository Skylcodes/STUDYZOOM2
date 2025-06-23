import { type DayOfWeek } from '../prisma-mappings';

import type { StudyTimeSlotDto } from '@/types/dtos/work-time-slot-dto';

// Domain-aligned DTO for study schedule
export type StudyScheduleDto = {
  dayOfWeek: DayOfWeek;
  timeSlots?: StudyTimeSlotDto[];
};

// For backward compatibility during refactoring
export type WorkHoursDto = StudyScheduleDto;
