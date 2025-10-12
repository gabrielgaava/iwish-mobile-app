import { CustomDarkTheme, CustomDefaultTheme } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { AuthProvider } from "@/lib/AuthContext";
import { ThemeProvider } from "@react-navigation/native";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { ThemeProvider as StyledThemeProvider } from "styled-components/native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const useTheme = colorScheme === "dark" ? CustomDarkTheme : CustomDefaultTheme;

  return (
    <AuthProvider>
      <StyledThemeProvider theme={useTheme}>
        <ThemeProvider value={useTheme}>
          <StatusBar style="auto" />
          <Stack>
            <Stack.Screen name="(protected)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          </Stack>
        </ThemeProvider>
      </StyledThemeProvider>
    </AuthProvider>
  );
}
