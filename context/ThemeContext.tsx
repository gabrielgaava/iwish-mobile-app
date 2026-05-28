import { getAppValue, setAppValue } from "@/lib/storage";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

const STORAGE_KEY = "WishHubApp-ThemePreference";

type ThemePreference = "dark" | "light" | "system";

type ThemeContextType = {
  isDarkMode: boolean;
  preference: ThemePreference;
  setPreference: (pref: ThemePreference) => void;
};

export const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export function ThemeContextProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>("system");

  // Carrega preferência salva ao iniciar
  useEffect(() => {
    async function load() {
      const stored = await getAppValue(STORAGE_KEY);
      if (stored) {
        setPreferenceState(JSON.parse(stored) as ThemePreference);
      }
    }
    load();
  }, []);

  const setPreference = useCallback(async (pref: ThemePreference) => {
    setPreferenceState(pref);
    await setAppValue(STORAGE_KEY, pref);
  }, []);

  const isDarkMode =
    preference === "system" ? systemScheme === "dark" : preference === "dark";

  return (
    <ThemeContext.Provider value={{ isDarkMode, preference, setPreference }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
