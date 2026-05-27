import { getAppValue, setAppValue } from "@/lib/storage";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "iWishApp-RecentSearches";
const MAX_RECENTS = 8;

export type RecentUser = {
  id: string;
  name: string;
  username?: string | null;
  image?: string | null;
};

export function useRecentSearches() {
  const [recents, setRecents] = useState<RecentUser[]>([]);

  const loadRecents = useCallback(async () => {
    const raw = await getAppValue(STORAGE_KEY);
    if (raw) setRecents(JSON.parse(raw));
  }, []);

  const addRecent = useCallback(async (user: RecentUser) => {
    const raw = await getAppValue(STORAGE_KEY);
    const current: RecentUser[] = raw ? JSON.parse(raw) : [];
    const filtered = current.filter((u) => u.id !== user.id);
    const updated = [user, ...filtered].slice(0, MAX_RECENTS);
    await setAppValue(STORAGE_KEY, updated);
    setRecents(updated);
  }, []);

  const clearRecents = useCallback(async () => {
    await setAppValue(STORAGE_KEY, []);
    setRecents([]);
  }, []);

  useEffect(() => {
    loadRecents();
  }, [loadRecents]);

  return { recents, addRecent, clearRecents };
}
