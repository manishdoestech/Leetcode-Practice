import { useEffect, useState } from "react";
import { LeetCodeStatsApi } from "./types";
import { fetchLeetCodeStats } from "./utils";

interface UseLeetCodeStatsReturn {
  stats: LeetCodeStatsApi | null;
  loading: boolean;
  error: string | null;
}

// Global cache to store stats across component re-renders and page navigations
const globalStatsCache: {
  data: LeetCodeStatsApi | null;
  loading: boolean;
  error: string | null;
  fetched: boolean;
} = {
  data: null,
  loading: false,
  error: null,
  fetched: false,
};

export function useLeetCodeStats(): UseLeetCodeStatsReturn {
  const [stats, setStats] = useState<LeetCodeStatsApi | null>(globalStatsCache.data);
  const [loading, setLoading] = useState<boolean>(!globalStatsCache.fetched);
  const [error, setError] = useState<string | null>(globalStatsCache.error);

  useEffect(() => {
    // If we already have cached data, use it and don't fetch again
    if (globalStatsCache.fetched) {
      setStats(globalStatsCache.data);
      setLoading(false);
      setError(globalStatsCache.error);
      return;
    }

    // Only fetch if we haven't fetched before
    if (!globalStatsCache.loading) {
      globalStatsCache.loading = true;
      setLoading(true);

      fetchLeetCodeStats()
        .then((data) => {
          globalStatsCache.data = data;
          globalStatsCache.loading = false;
          globalStatsCache.error = null;
          globalStatsCache.fetched = true;

          setStats(data);
          setLoading(false);
          setError(null);
        })
        .catch((err) => {
          globalStatsCache.loading = false;
          globalStatsCache.error = err.message;
          globalStatsCache.fetched = true;

          setError(err.message);
          setLoading(false);
        });
    }
  }, []);

  return { stats, loading, error };
}
