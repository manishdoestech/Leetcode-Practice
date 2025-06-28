"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface ProblemFilterContextType {
  search: string;
  setSearch: (s: string) => void;
  sort: "number" | "title";
  setSort: (s: "number" | "title") => void;
  filter: "all" | "easy" | "medium" | "hard";
  setFilter: (f: "all" | "easy" | "medium" | "hard") => void;
}

const ProblemFilterContext = createContext<
  ProblemFilterContextType | undefined
>(undefined);

export function useProblemFilter() {
  const ctx = useContext(ProblemFilterContext);
  if (!ctx)
    throw new Error(
      "useProblemFilter must be used within ProblemFilterProvider"
    );
  return ctx;
}

export function ProblemFilterProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"number" | "title">("number");
  const [filter, setFilter] = useState<"all" | "easy" | "medium" | "hard">(
    "all"
  );

  return (
    <ProblemFilterContext.Provider
      value={{ search, setSearch, sort, setSort, filter, setFilter }}
    >
      {children}
    </ProblemFilterContext.Provider>
  );
}
