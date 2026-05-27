import { ProfileView } from "@/components/profile/ProfileView";
import { TAB_BAR_SCROLL_INSET } from "@/components/ui/tab-scroll-view";
import { api } from "@/lib/api";
import { UserProfile } from "@/types/User";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator } from "react-native";

export default function ProfileScreen() {
  const [isFetching, setIsFetching] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const { refresh } = useLocalSearchParams<{ refresh?: string }>();

  const refreshProfileData = useCallback(async () => {
    setIsFetching(true);
    const response = await api.get<UserProfile>("/users/me");

    if (response.status !== 200) {
      console.log("Error Retrive User", response.data);
      setIsFetching(false);
      return;
    }

    setUser(response.data);
    setIsFetching(false);
  }, []);

  useFocusEffect(useCallback(() => {
    if (!user?.id || refresh === "1") {
      refreshProfileData();
    }

    if (refresh === "1") {
      router.replace("/profile");
    }
  }, [refresh, refreshProfileData, user?.id]));

  if (isFetching && !user) {
    return <ActivityIndicator size="large" />;
  }

  if (!user) {
    return null;
  }

  const handleEditProfile = useCallback(() => {
    router.push("/(protected)/(tabs)/profile/edit");
  }, []);

  return (
    <ProfileView
      user={user}
      isOwnProfile
      onEditProfile={handleEditProfile}
      bottomSpacing={TAB_BAR_SCROLL_INSET}
    />
  );
}
