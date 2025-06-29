"use client";
import React, { useMemo, useState } from "react";
import { ProblemCard } from "@/components/ProblemCard";
import { Separator } from "@/components/ui/separator";
import type { Problem } from "@/lib/problems";
import { useProblemFilter } from "@/context/ProblemFilterContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function HomePageClient({
  problems,
}: Readonly<{ problems: Problem[] }>) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const {
    search,
    setSearch,
    sort,
    setSort,
    filter,
    setFilter,
    topic,
    setTopic,
  } = useProblemFilter();

  // derive unique topics from problems
  const topicsList = useMemo(() => {
    const all = problems.flatMap((p) => p.topics || []);
    return Array.from(new Set(all));
  }, [problems]);

  // Convert string arrays to Option arrays for MultipleSelector
  const difficultyOptions: Option[] = ["Easy", "Medium", "Hard"].map((d) => ({
    value: d,
    label: d,
  }));
  const topicOptions: Option[] = topicsList.map((t) => ({
    value: t,
    label: t,
  }));

  const filteredProblems = useMemo(() => {
    // Start with all problems
    let result = problems;
    // Filter by difficulty: OR within selected difficulties
    if (filter.length > 0) {
      result = result.filter((p) =>
        filter.some((f) => f.value === p.difficulty)
      );
    }
    // Filter by topics: OR within selected topics
    if (topic.length > 0) {
      const selectedTopics = topic.map((t) => t.value);
      result = result.filter((p) => {
        if (!p.topics) return false;
        return p.topics.some((t) => selectedTopics.includes(t));
      });
    }
    // Text search filter
    if (search.trim()) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.id.toLowerCase().includes(search.toLowerCase())
      );
    }
    // Sorting
    const sorted = [...result];
    if (sort === "title") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      sorted.sort((a, b) => {
        const aNum = parseInt(a.id.split("-")[0], 10);
        const bNum = parseInt(b.id.split("-")[0], 10);
        return aNum - bNum;
      });
    }
    return sorted;
  }, [problems, filter, topic, search, sort]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProblems = filteredProblems.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filter, topic, search, sort]);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Search, Sort & Filter Controls */}
        <div className="flex flex-col gap-4 mb-6">
          {/* text search */}
          <Input
            placeholder="Search by title or number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:max-w-xs"
          />
          {/* sort pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Sort: Number", value: "number" },
              { label: "Sort: Title", value: "title" },
            ].map((opt) => (
              <Button
                key={opt.value}
                variant={sort === opt.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSort(opt.value as "number" | "title")}
              >
                {opt.label}
              </Button>
            ))}
          </div>
          {/* Filters side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* difficulty selector */}
            <div>
              <span className="text-sm font-medium mb-2 block">
                Difficulty:
              </span>
              <MultipleSelector
                value={filter}
                onChange={setFilter}
                options={difficultyOptions}
                placeholder="Type to search difficulties..."
                className="w-full"
                hidePlaceholderWhenSelected
                emptyIndicator={
                  <p className="text-center text-sm text-muted-foreground">
                    No difficulties found. Try &ldquo;Easy&rdquo;,
                    &ldquo;Medium&rdquo;, or &ldquo;Hard&rdquo;.
                  </p>
                }
              />
            </div>
            {/* topic selector */}
            <div>
              <span className="text-sm font-medium mb-2 block">Topics:</span>
              <MultipleSelector
                value={topic}
                onChange={setTopic}
                options={topicOptions}
                placeholder="Type to search topics..."
                className="w-full"
                hidePlaceholderWhenSelected
                emptyIndicator={
                  <p className="text-center text-sm text-muted-foreground">
                    No topics found. Try typing keywords like
                    &ldquo;array&rdquo;, &ldquo;tree&rdquo;,
                    &ldquo;graph&rdquo;...
                  </p>
                }
              />
            </div>
          </div>
        </div>
        <Separator className="mb-8" />

        {/* Results summary */}
        {filteredProblems.length > 0 && (
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {startIndex + 1}-
            {Math.min(endIndex, filteredProblems.length)} of{" "}
            {filteredProblems.length} problems
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProblems.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}

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
