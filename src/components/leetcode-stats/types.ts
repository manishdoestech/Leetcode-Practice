export interface LeetCodeStatsApi {
  status: string;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  acceptanceRate?: number;
  submissionCalendar?: Record<string, number>;
}

export interface ProblemData {
  name: string;
  solved: number;
  total: number;
}

export interface LegendData extends ProblemData {
  colorSolved: string;
  colorUnsolved: string;
}

export interface CalendarData {
  date: string;
  count: number;
}
