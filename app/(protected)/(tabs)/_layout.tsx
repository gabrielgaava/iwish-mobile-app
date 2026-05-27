import { Tabs } from "expo-router";
import React, { useCallback } from "react";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

import { CustomTabBar } from "@/components/custom-tab-bar";

export default function TabLayout() {
  const renderTabBar = useCallback(
    (props: BottomTabBarProps) => <CustomTabBar {...props} />,
    []
  );

  return (
    <Tabs
      backBehavior="order"
      tabBar={renderTabBar}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="(home)" options={{ title: "Home" }} />
      <Tabs.Screen name="search" options={{ title: "Search" }} />
      <Tabs.Screen name="create" options={{ title: "Create" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}
