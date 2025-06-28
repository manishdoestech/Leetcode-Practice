"use client";
import React, { useEffect, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Card, CardContent } from "@/components/ui/card";

const API_URL = "https://leetcode-stats-api.herokuapp.com/manishdoestech";

interface LeetCodeStatsApi {
  status: string;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  submissionCalendar?: Record<string, number>;
}

function OdometerChart({
  data,
}: Readonly<{ data: { name: string; solved: number; total: number }[] }>) {
  // SVG/clipPath mask for LeetCode-style odometer
  // Arc math
  const totalQuestions = data.reduce((sum, d) => sum + d.total, 0);
  const totalSolved = data.reduce((sum, d) => sum + d.solved, 0);
  const radius = 42;
  const center = 50;
  const strokeWidth = 3;
  const circleLength = 2 * Math.PI * radius;
  // Angles for each section
  const easy = data[0];
  const medium = data[1];
  const hard = data[2];
  const easyLen = (easy.total / totalQuestions) * circleLength;
  const mediumLen = (medium.total / totalQuestions) * circleLength;
  const hardLen = (hard.total / totalQuestions) * circleLength;
  const easySolvedLen = (easy.solved / easy.total) * easyLen;
  const mediumSolvedLen = (medium.solved / medium.total) * mediumLen;
  const hardSolvedLen = (hard.solved / hard.total) * hardLen;
  // Mask path for donut
  const maskPath =
    "M21.36 21.36C5.55 37.18 5.55 62.82 21.36 78.64C21.95 79.22 21.95 80.17 21.36 80.76C20.78 81.34 19.83 81.34 19.24 80.76C2.25 63.77 2.25 36.23 19.24 19.24C36.23 2.25 63.77 2.25 80.76 19.24C97.75 36.23 97.75 63.77 80.76 80.76C80.17 81.34 79.22 81.34 78.64 80.76C78.05 80.17 78.05 79.22 78.64 78.64C94.45 62.82 94.45 37.18 78.64 21.36C62.82 5.55 37.18 5.55 21.36 21.36Z";
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 160, height: 160 }}
    >
      <svg
        viewBox="0 0 100 100"
        width={160}
        height={160}
        className="absolute left-0 top-0"
      >
        <defs>
          <clipPath id="bar-mask">
            <path d={maskPath} />
          </clipPath>
        </defs>
        <g clipPath="url(#bar-mask)">
          {/* Easy unsolved */}
          <g
            style={{ transform: "rotate(225deg)", transformOrigin: "50% 50%" }}
          >
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#bbf7d0"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={`${easyLen},${circleLength - easyLen}`}
              strokeDashoffset={66}
              strokeLinecap="round"
            />
            {/* Easy solved */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#059669"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={`${easySolvedLen},${
                circleLength - easySolvedLen
              }`}
              strokeDashoffset={66}
              strokeLinecap="round"
            />
          </g>
          {/* Medium unsolved */}
          <g
            style={{
              transform: `rotate(${295.42}deg)`,
              transformOrigin: "50% 50%",
            }}
          >
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#fef9c3"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={`${mediumLen},${circleLength - mediumLen}`}
              strokeDashoffset={66}
              strokeLinecap="round"
            />
            {/* Medium solved */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#eab308"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={`${mediumSolvedLen},${
                circleLength - mediumSolvedLen
              }`}
              strokeDashoffset={66}
              strokeLinecap="round"
            />
          </g>
          {/* Hard unsolved */}
          <g
            style={{
              transform: `rotate(${435.36}deg)`,
              transformOrigin: "50% 50%",
            }}
          >
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#fecaca"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={`${hardLen},${circleLength - hardLen}`}
              strokeDashoffset={66}
              strokeLinecap="round"
            />
            {/* Hard solved */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#b91c1c"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={`${hardSolvedLen},${
                circleLength - hardSolvedLen
              }`}
              strokeDashoffset={66}
              strokeLinecap="round"
            />
          </g>
        </g>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-[30px] font-semibold leading-[32px]">
          {totalSolved}
          <span className="text-base font-normal">/{totalQuestions}</span>
        </div>
        <div className="text-xs leading-normal p-1 mt-1">Solved</div>
      </div>
    </div>
  );
}

function OdometerLegend({
  data,
}: Readonly<{
  data: {
    name: string;
    solved: number;
    total: number;
    colorSolved: string;
    colorUnsolved: string;
  }[];
}>) {
  return (
    <div className="flex flex-col gap-2 justify-center">
      {data.map((d) => (
        <div key={d.name} className="flex items-center gap-2 text-sm">
          <span
            className="inline-block w-4 h-4 rounded"
            style={{
              background: d.colorSolved,
              border: `2px solid ${d.colorUnsolved}`,
            }}
          ></span>
          <span className="font-medium w-16">{d.name}</span>
          <span className="text-xs text-gray-500">
            {d.solved} / {d.total}
          </span>
        </div>
      ))}
    </div>
  );
}

function ShimmerLoader() {
  return (
    <div className="flex justify-center my-8">
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-5 flex flex-col items-center">
          <div className="bg-gray-200 dark:bg-neutral-800 rounded-2xl h-[220px] w-[180px] mb-4 animate-pulse" />
          <div className="bg-gray-200 dark:bg-neutral-800 rounded-lg h-6 w-32 animate-pulse" />
          <div className="bg-gray-200 dark:bg-neutral-800 rounded-lg h-4 w-24 mt-2 animate-pulse" />
        </div>
        <div className="md:col-span-7 flex justify-center">
          <div className="bg-gray-200 dark:bg-neutral-800 rounded-2xl h-[220px] w-[60vw] animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function LeetCodeStats() {
  const [stats, setStats] = useState<LeetCodeStatsApi | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <ShimmerLoader />;
  if (!stats || stats.status !== "success")
    return <div className="my-8">Failed to load LeetCode stats.</div>;

  const chartData = [
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

  const legendData = [
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

  // Prepare heatmap data: include every day from Jan 1 to today
  const submissionCal = stats.submissionCalendar ?? {};
  const dateMap: Record<string, number> = {};
  Object.entries(submissionCal).forEach(([ts, cnt]) => {
    const ds = new Date(Number(ts) * 1000).toISOString().slice(0, 10);
    dateMap[ds] = Number(cnt);
  });
  const startDate = new Date(new Date().getFullYear(), 0, 1);
  const endDate = new Date();
  const dates: Date[] = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d));
  }
  const calendarData = dates.map((d) => {
    const ds = d.toISOString().slice(0, 10);
    return { date: ds, count: dateMap[ds] ?? 0 };
  });

  return (
    <div className="my-8 flex justify-center">
      <div className="w-full max-w-3xl">
        <div className="flex flex-col md:flex-row gap-4 w-full">
          {/* Left Panel - Odometer (40%) */}
          <div className="md:w-2/5 w-full">
            <Card className="w-full h-full flex flex-col items-center justify-center">
              <CardContent>
                <div className="flex flex-col items-center justify-center w-full">
                  <OdometerChart data={chartData} />
                  <div className="mt-4 flex justify-center">
                    <OdometerLegend data={legendData} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Heatmap (60%) */}
          <div className="md:w-3/5 w-full">
            <Card className="w-full h-full">
              <CardContent>
                <div className="w-full">
                  <CalendarHeatmap
                    startDate={startDate}
                    endDate={endDate}
                    values={calendarData}
                    classForValue={(value: { count?: number } | null) => {
                      if (!value || value.count === 0) return "color-empty";
                      if (value.count! < 10) return "color-github-1";
                      if (value.count! < 20) return "color-github-2";
                      if (value.count! < 30) return "color-github-3";
                      if (value.count! < 40) return "color-github-4";
                      return "color-github-5";
                    }}
                    tooltipDataAttrs={(
                      value: { date: string; count: number } | null
                    ) => {
                      if (!value) return {};
                      const { date, count } = value;
                      const label =
                        count === 1 ? "contribution" : "contributions";
                      return { title: `${date}: ${count} ${label}` };
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
