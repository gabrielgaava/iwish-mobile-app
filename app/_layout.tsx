import { CustomDarkTheme, CustomDefaultTheme } from "@/constants/theme";
import { AuthProvider } from "@/context/AuthContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Poppins_300Light, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";
import { ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider as StyledThemeProvider } from "styled-components/native";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const useTheme = colorScheme === "dark" ? CustomDarkTheme : CustomDefaultTheme;

  const [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <StyledThemeProvider theme={useTheme}>
      <ThemeProvider value={useTheme}>
        <AuthProvider>
          <SafeAreaProvider>
            <StatusBar style="auto" />
            <Stack>
              <Stack.Screen name="(protected)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            </Stack>
          </SafeAreaProvider>
        </AuthProvider>
      </ThemeProvider>
    </StyledThemeProvider>
  );
}
