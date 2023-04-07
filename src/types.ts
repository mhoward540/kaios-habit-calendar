export type DateString = string

export enum CalendarEntryStatus {
  DONE = "DONE",
  PARTIAL = "PARTIAL",
  FAILED = "FAILED",
  EMPTY = "EMPTY",
}

export interface CalendarEntry {
  status: CalendarEntryStatus;
  // "yyyy-mm-dd"
  date: DateString;
}

export interface CalendarMonth {
  // mm-dd
  [key: string]: CalendarEntry,
}

export interface CalendarYear {
  // yyyy
  [key: string]: CalendarMonth
}

export interface HabitData {
  // some habit name
  [key: string]: CalendarYear
}

