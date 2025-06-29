"use client";
import React, { createContext, useContext, useState, ReactNode, useMemo } from "react";
import { Option } from "@/components/ui/multiple-selector";

interface ProblemFilterContextType {
  search: string;
  setSearch: (s: string) => void;
  sort: "number" | "title";
  setSort: (s: "number" | "title") => void;
  filter: Option[];
  setFilter: (f: Option[]) => void;
  topic: Option[];
  setTopic: (t: Option[]) => void;
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

export function ProblemFilterProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"number" | "title">("number");
  // Start with all difficulties selected
  const allDifficulties: Option[] = ["Easy", "Medium", "Hard"].map(d => ({ value: d, label: d }));
  const [filter, setFilter] = useState<Option[]>(allDifficulties);
  const [topic, setTopic] = useState<Option[]>([]);

  // Memoize context value to avoid unnecessary re-renders
  const value = useMemo(
    () => ({ search, setSearch, sort, setSort, filter, setFilter, topic, setTopic }),
    [search, sort, filter, topic]
  );

  return (
    <ProblemFilterContext.Provider value={value}>
      {children}
    </ProblemFilterContext.Provider>
  );
}
