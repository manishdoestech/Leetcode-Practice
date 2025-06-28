"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useProblemFilter } from "@/context/ProblemFilterContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { search, setSearch, sort, setSort, filter, setFilter } =
    useProblemFilter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 dark:bg-black/90 backdrop-blur border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="container mx-auto flex flex-row items-center justify-between gap-4 py-3 px-4">
        <h1 className="text-2xl font-bold text-left text-gray-900 dark:text-white">
          LeetCode Tracker
        </h1>
        <div className="flex flex-row items-center gap-2 w-auto justify-end">
          <Input
            placeholder="Search by title or number..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
            className="max-w-xs"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="min-w-[120px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Sort: {sort === "number" ? "Number" : "Title"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSort("number")}>
                Number
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort("title")}>
                Title
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex gap-1">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              variant={filter === "easy" ? "default" : "outline"}
              onClick={() => setFilter("easy")}
            >
              Easy
            </Button>
            <Button
              variant={filter === "medium" ? "default" : "outline"}
              onClick={() => setFilter("medium")}
            >
              Medium
            </Button>
            <Button
              variant={filter === "hard" ? "default" : "outline"}
              onClick={() => setFilter("hard")}
            >
              Hard
            </Button>
          </div>
          <button
            aria-label="Toggle theme"
            className="ml-2 p-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {mounted &&
              (theme === "dark" ? <Sun size={18} /> : <Moon size={18} />)}
          </button>
        </div>
      </div>
    </nav>
  );
}
