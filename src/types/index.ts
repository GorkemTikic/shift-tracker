export type ActivityCategory = 
  | 'Online'
  | 'AD HOC'
  | 'Short Break'
  | 'Meal Break'
  | 'Wrap-Up'
  | 'Meeting'
  | 'Training'
  | 'Shift-End'
  | 'Log-Out';

export const CATEGORY_ORDER: ActivityCategory[] = [
  'Online',
  'AD HOC',
  'Short Break',
  'Meal Break',
  'Wrap-Up',
  'Meeting',
  'Training',
  'Shift-End',
  'Log-Out',
];

export interface Segment {
  id: string;
  startTime: string; // Format "HH:mm" (24-hour)
  endTime: string;   // Format "HH:mm" (24-hour)
  category: ActivityCategory;
  notes: string;
}

export interface DayEntry {
  date: string; // Format "YYYY-MM-DD"
  isOffDay?: boolean;
  segments: Segment[];
}

export interface ShiftData {
  [date: string]: DayEntry;
}
