// Domain-aligned DTO for study time slots
export type StudyTimeSlotDto = {
  id: string;
  start: string;
  end: string;
};

// For backward compatibility during refactoring
export type WorkTimeSlotDto = StudyTimeSlotDto;
