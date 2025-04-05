export interface WorkTimeInfo {
  startTime: Date | null;
  endTime: Date | null;
  breakDuration: number; // Break duration in minutes
  expectedEndTime?: Date | null; // Calculated expected end time based on 8h workday
}