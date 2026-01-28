export interface Period {
  id: number;
  name: string;
  start: string;
  end: string;
}

export interface TimeSlot {
  id: string;
  day: string;
  period: string;
  startTime: string;
  endTime: string;
  location: string;
  frequency: 'Weekly' | 'Odd Weeks' | 'Even Weeks';
}

export interface Course {
  id: string;
  name: string;
  instructor: string;
  timeSlots: TimeSlot[];
  icon?: string;
}

export interface AppState {
  step: 'upload' | 'config' | 'review' | 'success';
  language: 'zh' | 'en';
  image: string | null;
  institution: string;
  address: string;
  startDate: string;
  totalWeeks: number;
  duration: number;
  courses: Course[];
  periods: Period[];
  loading: boolean;
  statusMessage: string;
}

export enum DayOfWeek {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday'
}
