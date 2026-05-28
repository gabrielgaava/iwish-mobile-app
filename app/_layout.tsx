import { CustomDarkTheme, CustomDefaultTheme } from "@/constants/theme";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeContextProvider, useAppTheme } from "@/context/ThemeContext";
import { PlusJakartaSans_300Light, PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_700Bold } from "@expo-google-fonts/plus-jakarta-sans";
import { useFonts } from "@expo-google-fonts/poppins";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ThemeProvider } from "@react-navigation/native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider as StyledThemeProvider } from "styled-components/native";

GoogleSignin.configure({
  iosClientId: "604176384181-6qhbp4ditta249f7a3v2g09ln1di0tos.apps.googleusercontent.com",
  webClientId: "604176384181-pds7paq5eu7bksivhn3347r31d40jp48.apps.googleusercontent.com",
});

// Componente separado para poder consumir ThemeContext
// (ThemeContextProvider precisa estar por fora)
function ThemedApp() {
  const { isDarkMode } = useAppTheme();
  const theme = isDarkMode ? CustomDarkTheme : CustomDefaultTheme;

  return (
    <StyledThemeProvider theme={theme}>
      <ThemeProvider value={theme}>
        <AuthProvider>
          <SafeAreaProvider>
            <BottomSheetModalProvider>
              <StatusBar style={isDarkMode ? "light" : "dark"} />
              <Stack>
                <Stack.Screen name="(protected)" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              </Stack>
            </BottomSheetModalProvider>
          </SafeAreaProvider>
        </AuthProvider>
      </ThemeProvider>
    </StyledThemeProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_300Light,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeContextProvider>
        <ThemedApp />
      </ThemeContextProvider>
    </GestureHandlerRootView>
  );
}
