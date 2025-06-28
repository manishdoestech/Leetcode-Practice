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
        return "bg-green-100 text-green-800 border-green-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Hard":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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
      <div className="relative group">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          className="rounded-3xl"
        />
        <Card className="h-full border border-gray-200 group-hover:border-transparent group-hover:shadow-lg transition-all duration-200 rounded-3xl focus:outline-none overflow-hidden">
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
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
                <a
                  href={`https://leetcode.com/problems/${problem.id
                    .replace(/^\d+-/, "")
                    .replace(/_/g, "-")
                    .toLowerCase()}/description/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition-transform"
                  title="View on LeetCode"
                  onClick={(e) => e.stopPropagation()}
                >
                  <LeetCodeIcon size={22} />
                </a>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <CardDescription className="text-gray-600 text-sm leading-relaxed">
              {extractDescription(problem.description)}
            </CardDescription>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>
                {problem.solutions.length} solution
                {problem.solutions.length !== 1 ? "s" : ""}
              </span>
              <div className="flex gap-1">
                {problem.solutions.map((solution) => (
                  <Badge
                    key={solution.filename}
                    variant="outline"
                    className="text-xs bg-gray-50 text-gray-700 border-gray-200"
                  >
                    {solution.language}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Link>
  );
}
