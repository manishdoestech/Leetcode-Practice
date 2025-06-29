"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Problem } from "@/lib/problems";
import { LeetCodeIcon } from "./LeetCodeIcon";
import { GlowingEffect } from "@/components/ui/glowing-effect";

interface ProblemCardProps {
  readonly problem: Problem;
}

export function ProblemCard({ problem }: ProblemCardProps) {
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700";
      case "Medium":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700";
      case "Hard":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600";
    }
  };

  const extractDescription = (markdown: string) => {
    // Remove HTML tags and get first few lines
    const cleanText = markdown
      .replace(/<[^>]*>/g, " ")
      .replace(/\n+/g, " ")
      .trim();

    const words = cleanText.split(" ").slice(0, 20);
    return words.length === 20 ? words.join(" ") + "..." : words.join(" ");
  };

  return (
    <Link href={`/problem/${problem.id}`} className="block focus:outline-none">
      <div className="relative group problem-card">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          className="rounded-3xl"
        />
        <Card className="h-full border border-gray-200 dark:border-gray-700 group-hover:border-transparent group-hover:shadow-lg transition-all duration-200 rounded-3xl focus:outline-none overflow-hidden">
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                {problem.title}
              </CardTitle>
              <div className="flex items-center gap-2">
                {problem.difficulty && (
                  <Badge
                    variant="secondary"
                    className={`${getDifficultyColor(
                      problem.difficulty
                    )} text-xs font-medium`}
                  >
                    {problem.difficulty}
                  </Badge>
                )}
                <button
                  className="hover:scale-110 transition-transform"
                  title="View on LeetCode"
                  onClick={(e) => {
                    e.stopPropagation();
                    const url = `https://leetcode.com/problems/${problem.id
                      .replace(/^\d+-/, "")
                      .replace(/_/g, "-")
                      .toLowerCase()}/description/`;
                    window.open(url, "_blank", "noopener");
                  }}
                >
                  <LeetCodeIcon size={22} />
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <CardDescription className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              {extractDescription(problem.description)}
            </CardDescription>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>
                {problem.solutions.length} solution
                {problem.solutions.length !== 1 ? "s" : ""}
              </span>
              <div className="flex gap-1">
                {problem.solutions.map((solution) => (
                  <Badge
                    key={solution.filename}
                    variant="outline"
                    className="text-xs bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 language-badge"
                  >
                    {solution.language}
                  </Badge>
                ))}
              </div>
            </div>
            {/* Topic tags */}
            {problem.topics && problem.topics.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {problem.topics.map((topic) => (
                  <Badge key={topic} variant="outline" className="text-xs">
                    {topic}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Link>
  );
}
