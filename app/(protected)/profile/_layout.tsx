import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="proflile"
        options={{
          title: "Profile",
          headerShown: false,
        }}
      />
    </Stack>
  );
}