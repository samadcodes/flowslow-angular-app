export interface Task {
  id: number;
  title: string;
  tags: string[];
  duration: string; // Formatted duration (e.g., "1h 14m")
  elapsedSeconds: number; // Raw duration in seconds for calculations
  status: string; //'idle' | 'active' | 'completed';
  createdAt: Date;
  isTemporary?: boolean; // Flag for temporary tasks that are being created
}