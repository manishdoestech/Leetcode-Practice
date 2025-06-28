import { LeetCodeStatsApi, CalendarData } from "./types";

export const API_URL = "https://leetcode-stats-api.herokuapp.com/manishdoestech";

export function transformCalendarData(
  submissionCalendar: Record<string, number> = {}
): CalendarData[] {
  const dateMap: Record<string, number> = {};
  const submissionDates: Date[] = [];
  
  // Process submission data and collect all submission dates
  Object.entries(submissionCalendar).forEach(([ts, cnt]) => {
    // Convert Unix timestamp to Date and format in local timezone
    const date = new Date(Number(ts) * 1000);
    submissionDates.push(date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const ds = `${year}-${month}-${day}`;
    dateMap[ds] = Number(cnt);
  });

  // If no submissions, return current year data
  if (submissionDates.length === 0) {
    const startDate = new Date(new Date().getFullYear(), 0, 1);
    const endDate = new Date();
    const dates: Date[] = [];
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }

    return dates.map((d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const ds = `${year}-${month}-${day}`;
      return { date: ds, count: 0 };
    });
  }

  // Find the earliest and latest submission dates
  const earliestDate = new Date(Math.min(...submissionDates.map(d => d.getTime())));
  const latestDate = new Date(Math.max(...submissionDates.map(d => d.getTime())));
  
  // Extend range to include full years and up to today
  const startDate = new Date(earliestDate.getFullYear(), 0, 1);
  const endDate = new Date(Math.max(latestDate.getTime(), new Date().getTime()));
  
  const dates: Date[] = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d));
  }

  return dates.map((d) => {
    // Format date in local timezone
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const ds = `${year}-${month}-${day}`;
    return { date: ds, count: dateMap[ds] ?? 0 };
  });
}

export async function fetchLeetCodeStats(): Promise<LeetCodeStatsApi> {
  const response = await fetch(API_URL);
  return response.json();
}
