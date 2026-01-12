import React, { useState, useMemo, useEffect } from "react";
import { Tooltip } from "react-tooltip";
import { CalendarData } from "./types";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Card } from "@/components/ui/card";

interface ContributionHeatmapProps {
  readonly data: CalendarData[];
  readonly recentSubmissions?: Array<{
    title: string;
    titleSlug: string;
    timestamp: string;
    statusDisplay: string;
    lang: string;
  }>;
  readonly totalSubmissions?: number;
  readonly activeDays?: number;
  readonly maxStreak?: number;
}

interface YearData {
  year: number;
  totalSubmissions: number;
  activeDays: number;
  maxStreak: number;
  data: CalendarData[];
}

interface HeatmapDay {
  date: Date;
  dateString: string;
  count: number;
  x: number;
  y: number;
  fill: string;
  isEmpty: boolean;
}

const CELL_SIZE = 11;
const CELL_GAP = 3;
const WEEK_WIDTH = CELL_SIZE + CELL_GAP;
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Hook to detect dark mode
function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      const isDark =
        document.documentElement.classList.contains("dark") ||
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(isDark);
    };

    checkDarkMode();

    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", checkDarkMode);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", checkDarkMode);
    };
  }, []);

  return isDarkMode;
}

function getFillColor(count: number, isDarkMode?: boolean): string {
  if (count === 0) return "var(--fill-tertiary)";

  // Use brighter colors for dark mode, dimmer for light mode
  if (isDarkMode) {
    if (count === 1) return "#4ade80"; // Brighter light green
    if (count <= 5) return "#22c55e"; // Bright green
    if (count <= 10) return "#16a34a"; // Medium green
    return "#15803d"; // Dark green
  } else {
    if (count === 1) return "#dcfce7"; // Very light green
    if (count <= 5) return "#bbf7d0"; // Light green
    if (count <= 10) return "#86efac"; // Medium light green
    return "#4ade80"; // Bright green
  }
}

function getYearsFromData(data: CalendarData[]): YearData[] {
  const yearMap = new Map<number, CalendarData[]>();

  data.forEach((item) => {
    const date = new Date(item.date);
    const year = date.getFullYear();

    if (!yearMap.has(year)) {
      yearMap.set(year, []);
    }
    yearMap.get(year)!.push(item);
  });

  return Array.from(yearMap.entries())
    .map(([year, yearData]) => {
      const totalSubmissions = yearData.reduce(
        (sum, day) => sum + day.count,
        0
      );
      const activeDays = yearData.filter((day) => day.count > 0).length;

      // Calculate max streak
      const sortedDays = [...yearData].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      let maxStreak = 0;
      let currentStreak = 0;

      for (const day of sortedDays) {
        if (day.count > 0) {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      }

      return {
        year,
        totalSubmissions,
        activeDays,
        maxStreak,
        data: yearData,
      };
    })
    .sort((a, b) => b.year - a.year);
}

function generateHeatmapForYear(
  year: number,
  data: CalendarData[],
  isDarkMode: boolean = false
): HeatmapDay[] {
  const days: HeatmapDay[] = [];
  const startDate = new Date(year, 0, 1);

  // Start from the first Sunday of the year or before
  const firstDay = startDate.getDay();
  const startCalendarDate = new Date(startDate);
  startCalendarDate.setDate(startDate.getDate() - firstDay);

  let currentX = 0;
  const currentDate = new Date(startCalendarDate);

  // Generate 53 weeks (371 days to cover any year)
  for (let week = 0; week < 53; week++) {
    for (let day = 0; day < 7; day++) {
      // Format date in local timezone to match the data
      const currentYear = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const dayStr = String(currentDate.getDate()).padStart(2, "0");
      const dateString = `${currentYear}-${month}-${dayStr}`;

      const dayData = data.find((d) => d.date === dateString);
      const count = dayData?.count ?? 0;

      const isEmpty = currentDate.getFullYear() !== year;

      days.push({
        date: new Date(currentDate),
        dateString,
        count,
        x: currentX,
        y: day * (CELL_SIZE + CELL_GAP),
        fill: isEmpty ? "transparent" : getFillColor(count, isDarkMode),
        isEmpty,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }
    currentX += WEEK_WIDTH;
  }

  return days;
}

export default function ContributionHeatmap({
  data = [],
  recentSubmissions = [],
  totalSubmissions,
  activeDays,
  maxStreak,
}: Readonly<ContributionHeatmapProps>) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const isDarkMode = useDarkMode();

  const yearsData = useMemo(() => getYearsFromData(data), [data]);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const selectedYearData = useMemo(() => {
    return (
      yearsData.find((y) => y.year === selectedYear) || {
        year: selectedYear,
        totalSubmissions: totalSubmissions ?? 0,
        activeDays: activeDays ?? 0,
        maxStreak: maxStreak ?? 0,
        data: [],
      }
    );
  }, [yearsData, selectedYear, totalSubmissions, activeDays, maxStreak]);

  const heatmapDays = useMemo(
    () =>
      generateHeatmapForYear(selectedYear, selectedYearData.data, isDarkMode),
    [selectedYear, selectedYearData.data, isDarkMode]
  );

  const monthLabels = useMemo(() => {
    const labels: { name: string; x: number }[] = [];
    let currentMonth = -1;

    heatmapDays.forEach((day, index) => {
      if (index % 7 === 0) {
        // First day of week
        const month = day.date.getMonth();
        if (month !== currentMonth && !day.isEmpty) {
          labels.push({
            name: MONTHS[month],
            x: day.x + CELL_SIZE / 2,
          });
          currentMonth = month;
        }
      }
    });

    return labels;
  }, [heatmapDays]);

  const totalWidth = 53 * WEEK_WIDTH;
  const totalHeight = 7 * (CELL_SIZE + CELL_GAP) + 20; // Extra space for month labels

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative group w-full">
      <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
        className="rounded-3xl"
      />
      <Card className="shadow-down-01 dark:shadow-dark-down-01 rounded-3xl flex h-auto flex-col space-y-4 p-4 pb-0 heatmap-container relative text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 group-hover:border-transparent group-hover:shadow-lg transition-all duration-200 overflow-hidden w-full">
        {/* Header Section */}
        <div className="lc-md:flex-row lc-md:items-center lc-md:space-y-0 flex flex-col flex-wrap space-y-2">
          <div className="flex flex-1 items-center">
            <span className="lc-md:text-xl mr-[5px] text-base font-medium">
              {selectedYearData.totalSubmissions}
            </span>
            <span className="lc-md:text-base whitespace-nowrap text-label-2 dark:text-white">
              submissions in{" "}
              {selectedYear === currentYear ? "current year" : selectedYear}
            </span>
            <div className="ml-1 mr-2 text-gray-5 dark:text-dark-gray-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12 11a1 1 0 011 1v4a1 1 0 11-2 0v-4a1 1 0 011-1zm0-3a1 1 0 110 2 1 1 0 010-2zm0 14C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </div>

          <div className="flex items-center text-xs">
            <div className="mr-4.5 space-x-1">
              <span className="text-label-3 dark:text-gray-300">
                Total active days:
              </span>
              <span className="font-medium text-label-2 dark:text-white">
                {selectedYearData.activeDays}
              </span>
            </div>
            <div className="space-x-1">
              <span className="text-label-3 dark:text-gray-300">
                Max streak:
              </span>
              <span className="font-medium text-label-2 dark:text-white">
                {selectedYearData.maxStreak}
              </span>
            </div>

            {/* Year Dropdown */}
            <div className="ml-[21px] relative">
              <button
                className="flex cursor-pointer items-center rounded px-3 py-1.5 text-left focus:outline-none whitespace-nowrap bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-800 border border-gray-200 dark:border-gray-600"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                type="button"
              >
                {selectedYear}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  className={`pointer-events-none ml-3 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                >
                  <path
                    fillRule="evenodd"
                    d="M4.929 7.913l7.078 7.057 7.064-7.057a1 1 0 111.414 1.414l-7.77 7.764a1 1 0 01-1.415 0L3.515 9.328a1 1 0 011.414-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full mt-1 right-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 min-w-[120px]">
                  {yearsData.map((yearData) => (
                    <button
                      key={yearData.year}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 first:rounded-t-lg last:rounded-b-lg text-sm text-gray-900 dark:text-gray-100"
                      onClick={() => handleYearSelect(yearData.year)}
                    >
                      <div className="font-medium text-gray-900 dark:text-white">
                        {yearData.year}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-300">
                        {yearData.totalSubmissions} submissions
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Heatmap */}
        {/* Heatmap container: enable full width scroll on small screens */}
        <div className="flex h-auto w-full flex-1 items-center justify-center overflow-auto">
          <div className="w-full">
            <svg
              viewBox={`0 0 ${totalWidth} ${totalHeight}`}
              className="w-auto"
              preserveAspectRatio="xMinYMin meet"
              style={{ minWidth: totalWidth }}
            >
              {/* Days */}
              {heatmapDays.map((day, index) => (
                <rect
                  key={`${day.dateString}-${index}`}
                  x={day.x}
                  y={day.y}
                  width={CELL_SIZE}
                  height={CELL_SIZE}
                  fill={day.fill}
                  rx="2"
                  ry="2"
                  className={!day.isEmpty ? "cursor-pointer hover:opacity-80" : ""}
                  {...(!day.isEmpty && {
                    "data-tooltip-id": "heatmap-tooltip",
                    "data-tooltip-content": `${new Date(day.date).toLocaleDateString(undefined, {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })} — ${day.count} ${day.count === 1 ? "question" : "questions"} solved`,
                  })}
                />
              ))}

              {/* Month Labels */}
              {monthLabels.map((month, index) => (
                <text
                  key={`${month.name}-${index}`}
                  x={month.x}
                  y={totalHeight - 5}
                  fontSize="12px"
                  fill={isDarkMode ? "#ffffff" : "#6b7280"}
                  textAnchor="middle"
                  className="text-xs"
                >
                  {month.name}
                </text>
              ))}
            </svg>
            <Tooltip
              id="heatmap-tooltip"
              place="top"
              delayShow={0}
              className="!bg-gray-900 dark:!bg-gray-100 !text-white dark:!text-gray-900 !text-xs !rounded-md !px-2 !py-1 !z-50"
            />
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs text-label-3 dark:text-white">
          <span>Less</span>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-sm bg-gray-200 dark:bg-gray-700"></div>
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: getFillColor(1, isDarkMode) }}
            ></div>
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: getFillColor(3, isDarkMode) }}
            ></div>
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: getFillColor(8, isDarkMode) }}
            ></div>
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: getFillColor(15, isDarkMode) }}
            ></div>
          </div>
          <span>More</span>
        </div>

        {/* Recent Submissions */}
        {recentSubmissions && recentSubmissions.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-label-1 dark:text-dark-label-1 mb-4">
              Recent Submissions
            </h3>
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Problem
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Language
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {recentSubmissions
                      .slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                      )
                      .map((submission, index) => (
                        <tr
                          key={`${submission.titleSlug}-${submission.timestamp}-${index}`}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {submission.title}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                submission.statusDisplay === "Accepted"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              }`}
                            >
                              {submission.statusDisplay}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {submission.lang}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(
                              parseInt(submission.timestamp) * 1000
                            ).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {recentSubmissions.length > itemsPerPage && (
                <div className="bg-white dark:bg-gray-900 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage(
                          Math.min(
                            Math.ceil(recentSubmissions.length / itemsPerPage),
                            currentPage + 1
                          )
                        )
                      }
                      disabled={
                        currentPage ===
                        Math.ceil(recentSubmissions.length / itemsPerPage)
                      }
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Showing{" "}
                        <span className="font-medium">
                          {(currentPage - 1) * itemsPerPage + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                          {Math.min(
                            currentPage * itemsPerPage,
                            recentSubmissions.length
                          )}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">
                          {recentSubmissions.length}
                        </span>{" "}
                        results
                      </p>
                    </div>
                    <div>
                      <nav
                        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                        aria-label="Pagination"
                      >
                        <button
                          onClick={() =>
                            setCurrentPage(Math.max(1, currentPage - 1))
                          }
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Previous</span>
                          <svg
                            className="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        {Array.from(
                          {
                            length: Math.ceil(
                              recentSubmissions.length / itemsPerPage
                            ),
                          },
                          (_, i) => i + 1
                        ).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              page === currentPage
                                ? "z-10 bg-indigo-50 dark:bg-indigo-900 border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-200"
                                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        <button
                          onClick={() =>
                            setCurrentPage(
                              Math.min(
                                Math.ceil(
                                  recentSubmissions.length / itemsPerPage
                                ),
                                currentPage + 1
                              )
                            )
                          }
                          disabled={
                            currentPage ===
                            Math.ceil(recentSubmissions.length / itemsPerPage)
                          }
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Next</span>
                          <svg
                            className="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
