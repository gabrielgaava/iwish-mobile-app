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
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />

      {/* Rotas compartilhadas entre tabs */}
      <Stack.Screen name="users/[userId]" options={{ title: "Perfil" }} />
      <Stack.Screen name="wishlist/index" options={{ title: "Wishlist" }} />
      <Stack.Screen name="wishlist/[id]" options={{ title: "Wishlist" }} />
      <Stack.Screen name="wish/create" options={{ title: "Criar Wish" }} />
    </Stack>
  );
}
