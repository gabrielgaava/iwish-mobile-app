import { useAuth } from "@/hooks/useAuth";
import { Redirect, Stack } from "expo-router";
import { ActivityIndicator } from "react-native";

export default function ProtectedLayout() {
  const { isLoggedIn, isReady } = useAuth();

  if(!isReady) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: "center", alignItems: "center" }} />;
  }

  if(!isLoggedIn) {
    console.log("User not logged in, redirecting to login screen");
    return <Redirect href="/(auth)/welcome" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
