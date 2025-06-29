"use client";
import React, { useMemo, useState } from "react";
import { ProblemCard } from "@/components/ProblemCard";
import { Separator } from "@/components/ui/separator";
import type { Problem } from "@/lib/problems";
import { useProblemFilter } from "@/context/ProblemFilterContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Filter, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function HomePageClient({
  problems,
}: Readonly<{ problems: Problem[] }>) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const { search, setSearch } = useProblemFilter();

  // Derive unique tags and difficulties from problems
  const allTags = useMemo(
    () => Array.from(new Set(problems.flatMap((p) => p.topics || []))),
    [problems]
  );
  // Removed unused allDifficulties variable (difficulties are now hardcoded for filter UI)

  // New filter state
  const [filters, setFilters] = useState<{
    tags: string[];
    difficulties: string[];
  }>({ tags: [], difficulties: [] });

  // Filtering logic
  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      // Search by title or number
      const matchesSearch =
        !search ||
        problem.title.toLowerCase().includes(search.toLowerCase()) ||
        problem.id.toLowerCase().includes(search.toLowerCase());
      // Tag filter (OR within tags)
      const tagMatch =
        filters.tags.length === 0 ||
        (problem.topics &&
          filters.tags.some((tag) => problem.topics.includes(tag)));
      // Difficulty filter (OR within difficulties)
      const difficultyMatch =
        filters.difficulties.length === 0 ||
        (problem.difficulty &&
          filters.difficulties.includes(problem.difficulty));
      // AND between tags and difficulties
      return matchesSearch && tagMatch && difficultyMatch;
    });
  }, [problems, search, filters]);

  // Filter handlers
  const handleTagToggle = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };
  const handleDifficultyToggle = (difficulty: string) => {
    setFilters((prev) => ({
      ...prev,
      difficulties: prev.difficulties.includes(difficulty)
        ? prev.difficulties.filter((d) => d !== difficulty)
        : [...prev.difficulties, difficulty],
    }));
  };
  const clearAllFilters = () => setFilters({ tags: [], difficulties: [] });
  const clearTagFilter = (tag: string) =>
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  const clearDifficultyFilter = (difficulty: string) =>
    setFilters((prev) => ({
      ...prev,
      difficulties: prev.difficulties.filter((d) => d !== difficulty),
    }));
  const totalActiveFilters = filters.tags.length + filters.difficulties.length;

  // Difficulty badge color helper
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-600 bg-green-50 border-green-200";
      case "Medium":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "Hard":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProblems = filteredProblems.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters, search]);
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Input
            placeholder="Search by title or number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:max-w-xs"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Filter className="h-4 w-4" />
                Filters
                {totalActiveFilters > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 px-1.5 py-0.5 text-xs"
                  >
                    {totalActiveFilters}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 p-4" align="start">
              <div className="space-y-4">
                {/* Tags Section */}
                <div>
                  <div className="px-0 pb-2 font-semibold text-sm">Tags</div>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                    {allTags.map((tag) => {
                      const isSelected = filters.tags.includes(tag);
                      return (
                        <Badge
                          key={tag}
                          variant={isSelected ? "default" : "outline"}
                          className={`cursor-pointer transition-colors hover:bg-primary/80 ${
                            isSelected
                              ? "bg-primary text-primary-foreground border-2 border-blue-500 dark:border-blue-400 shadow-md"
                              : "hover:bg-muted border border-gray-300 dark:border-gray-600"
                          }`}
                          onClick={() => handleTagToggle(tag)}
                        >
                          {tag}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
                <hr className="my-2 border-t border-gray-200 dark:border-gray-700" />
                {/* Difficulty Section */}
                <div>
                  <div className="px-0 pb-2 font-semibold text-sm">
                    Difficulty
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["Easy", "Medium", "Hard"].map((difficulty) => {
                      const isSelected =
                        filters.difficulties.includes(difficulty);
                      let badgeClasses = "cursor-pointer transition-colors ";
                      if (isSelected) {
                        switch (difficulty) {
                          case "Easy":
                            badgeClasses +=
                              "bg-green-600 text-white border-green-600 hover:bg-green-700 border-2 border-blue-500 dark:border-blue-400 shadow-md";
                            break;
                          case "Medium":
                            badgeClasses +=
                              "bg-orange-500 text-white border-orange-500 hover:bg-orange-600 border-2 border-blue-500 dark:border-blue-400 shadow-md";
                            break;
                          case "Hard":
                            badgeClasses +=
                              "bg-red-600 text-white border-red-600 hover:bg-red-700 border-2 border-blue-500 dark:border-blue-400 shadow-md";
                            break;
                        }
                      } else {
                        switch (difficulty) {
                          case "Easy":
                            badgeClasses +=
                              "text-green-600 bg-green-50 border-green-200 hover:bg-green-100 border border-gray-300 dark:border-gray-600";
                            break;
                          case "Medium":
                            badgeClasses +=
                              "text-orange-600 bg-orange-50 border-orange-200 hover:bg-orange-100 border border-gray-300 dark:border-gray-600";
                            break;
                          case "Hard":
                            badgeClasses +=
                              "text-red-600 bg-red-50 border-red-200 hover:bg-red-100 border border-gray-300 dark:border-gray-600";
                            break;
                        }
                      }
                      return (
                        <Badge
                          key={difficulty}
                          variant="outline"
                          className={badgeClasses}
                          onClick={() => handleDifficultyToggle(difficulty)}
                        >
                          {difficulty}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
                {totalActiveFilters > 0 && (
                  <>
                    <hr className="my-2 border-t border-gray-200 dark:border-gray-700" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="w-full justify-center"
                    >
                      Clear All Filters
                    </Button>
                  </>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Active Filters Display */}
          {totalActiveFilters > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-muted-foreground">
                Active filters:
              </span>
              {filters.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                  {tag}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0.5 hover:bg-transparent"
                    onClick={() => clearTagFilter(tag)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              {filters.difficulties.map((difficulty) => (
                <Badge
                  key={difficulty}
                  className={`gap-1 pr-1 ${getDifficultyColor(difficulty)}`}
                  variant="outline"
                >
                  {difficulty}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0.5 hover:bg-transparent"
                    onClick={() => clearDifficultyFilter(difficulty)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
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
