"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import OdometerChart from "./leetcode-stats/OdometerChart";
import OdometerLegend from "./leetcode-stats/OdometerLegend";
import ContributionHeatmap from "./leetcode-stats/ContributionHeatmap";
import ShimmerLoader from "./leetcode-stats/ShimmerLoader";
import { useLeetCodeStats } from "./leetcode-stats/hooks";
import { createChartData, createLegendData } from "./leetcode-stats/data";
import { transformCalendarData } from "./leetcode-stats/utils";

export default function LeetCodeStats() {
  const { stats, loading, error } = useLeetCodeStats();

  if (loading) return <ShimmerLoader />;
  if (error || !stats || stats.status !== "success") {
    return <div className="my-8">Failed to load LeetCode stats.</div>;
  }

  const chartData = createChartData(stats);
  const legendData = createLegendData(stats);
  const calendarData = transformCalendarData(stats.submissionCalendar);

  return (
    <div className="my-8 flex justify-center">
      <div className="w-full max-w-6xl">
        <div className="flex flex-col md:flex-row gap-4 w-full">
          {/* Left Panel - Odometer (40%) */}
          <div className="md:w-1/5 w-full">
            <div className="relative group">
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
                className="rounded-3xl"
              />
              <Card className="h-full border border-gray-200 dark:border-gray-700 group-hover:border-transparent group-hover:shadow-lg transition-all duration-200 rounded-3xl focus:outline-none overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center justify-center w-full h-full">
                    <OdometerChart
                      data={chartData}
                      acceptanceRate={stats.acceptanceRate}
                    />
                    <div className="mt-4 flex justify-center">
                      <OdometerLegend data={legendData} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Panel - Heatmap (60%) */}
          <div className="md:w-4/5 w-full flex items-center justify-center">
            <ContributionHeatmap
              data={calendarData}
              totalSubmissions={
                stats.easySolved + stats.mediumSolved + stats.hardSolved
              }
              activeDays={Object.keys(stats.submissionCalendar ?? {}).length}
              maxStreak={2}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
