import { AuthContext } from "@/lib/AuthContext";
import { Redirect, Stack } from "expo-router";
import { useContext } from "react";

export default function ProtectedLayout() {
  const authState = useContext(AuthContext);

  if (!authState.isReady) {
    console.log("Auth state not ready yet");
    return null;
  }

  if (!authState.isLoggedIn) {
    console.log("User not logged in, redirecting to login");
    return <Redirect href="/login" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}