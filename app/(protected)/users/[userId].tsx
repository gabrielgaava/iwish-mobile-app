import { ProfileView } from "@/components/profile/ProfileView";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import { api } from "@/lib/api";
import { UserProfile } from "@/types/User";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, BackHandler } from "react-native";

export default function PublicUserProfileScreen() {
  const { userId, from } = useLocalSearchParams<{ userId: string; from?: string }>();
  const [isFetching, setIsFetching] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const { addRecent } = useRecentSearches();

  const fetchProfileData = useCallback(async () => {
    if (!userId) {
      return;
    }

    setIsFetching(true);
    const response = await api.get<UserProfile>(`/users/${userId}`);

    if (response.status !== 200) {
      Alert.alert("Nao foi possivel carregar esse perfil.");
      setIsFetching(false);
      return;
    }

    const profileData: UserProfile = response.data;
    setUser(profileData);
    setIsFetching(false);

    addRecent({
      id: profileData.id,
      name: profileData.name,
      username: profileData.username,
      image: profileData.image,
    });
  }, [userId, addRecent]);

  useFocusEffect(useCallback(() => {
    fetchProfileData();
  }, [fetchProfileData]));

  const handleBack = useCallback(() => {
    const backRoute = from && !from.startsWith("/users/")
      ? from
      : "/search";

    return router.replace(backRoute as Parameters<typeof router.replace>[0]);
  }, [from]);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
        handleBack();
        return true;
      });

      return () => subscription.remove();
    }, [handleBack])
  );

  if (isFetching) {
    return <ActivityIndicator size="large" />;
  }

  if (!user) {
    return null;
  }

  return (
    <ProfileView
      user={user}
      onBack={handleBack}
    />
  );
}
