import { LeetCodeStatsApi, ProblemData, LegendData } from "./types";

export function createChartData(stats: LeetCodeStatsApi): ProblemData[] {
  return [
    {
      name: "Easy",
      solved: stats.easySolved,
      total: stats.totalEasy,
    },
    {
      name: "Medium",
      solved: stats.mediumSolved,
      total: stats.totalMedium,
    },
    {
      name: "Hard",
      solved: stats.hardSolved,
      total: stats.totalHard,
    },
  ];
}

export function createLegendData(stats: LeetCodeStatsApi): LegendData[] {
  return [
    {
      name: "Easy",
      solved: stats.easySolved,
      total: stats.totalEasy,
      colorSolved: "#059669",
      colorUnsolved: "#bbf7d0",
    },
    {
      name: "Medium",
      solved: stats.mediumSolved,
      total: stats.totalMedium,
      colorSolved: "#eab308",
      colorUnsolved: "#fef9c3",
    },
    {
      name: "Hard",
      solved: stats.hardSolved,
      total: stats.totalHard,
      colorSolved: "#b91c1c",
      colorUnsolved: "#fecaca",
    },
  ];
}
