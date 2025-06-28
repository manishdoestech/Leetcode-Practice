import { useEffect, useState } from "react";
import { LeetCodeStatsApi } from "./types";
import { fetchLeetCodeStats } from "./utils";

interface UseLeetCodeStatsReturn {
  stats: LeetCodeStatsApi | null;
  loading: boolean;
  error: string | null;
}

export function useLeetCodeStats(): UseLeetCodeStatsReturn {
  const [stats, setStats] = useState<LeetCodeStatsApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeetCodeStats()
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { stats, loading, error };
}
