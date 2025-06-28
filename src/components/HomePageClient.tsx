"use client";
import React, { useMemo } from "react";
import { ProblemCard } from "@/components/ProblemCard";
import { Separator } from "@/components/ui/separator";
import type { Problem } from "@/lib/problems";
import { useProblemFilter } from "@/context/ProblemFilterContext";

export function HomePageClient({
  problems,
}: Readonly<{ problems: Problem[] }>) {
  const { search, sort, filter } = useProblemFilter();

  const filteredProblems = useMemo(() => {
    let filtered = problems;
    if (filter !== "all") {
      filtered = filtered.filter(
        (p) => (p.difficulty ?? "").toLowerCase() === filter
      );
    }
    if (search.trim()) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.id.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (sort === "title") {
      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    } else {
      filtered = [...filtered].sort((a, b) => {
        const aNum = parseInt(a.id.split("-")[0]);
        const bNum = parseInt(b.id.split("-")[0]);
        return aNum - bNum;
      });
    }
    return filtered;
  }, [problems, search, sort, filter]);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <Separator className="mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProblems.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
        </div>
        {filteredProblems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No problems found. Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
