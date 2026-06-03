import { ProfileView } from "@/components/profile/ProfileView";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import { api } from "@/lib/api";
import { UserProfile } from "@/types/User";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, BackHandler } from "react-native";

// Cache de perfis públicos visitados — sobrevive a unmount/remount
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutos
type CacheEntry = { data: UserProfile; cachedAt: number };
const profileCache = new Map<string, CacheEntry>();

function getCached(userId: string): UserProfile | null {
  const entry = profileCache.get(userId);
  if (!entry) return null;
  return Date.now() - entry.cachedAt < CACHE_TTL_MS ? entry.data : null;
}

export function invalidateProfileCache(userId: string) {
  profileCache.delete(userId);
}

export default function PublicUserProfileScreen() {
  const { userId, from } = useLocalSearchParams<{ userId: string; from?: string }>();
  const { addRecent } = useRecentSearches();

  const cachedData = userId ? getCached(userId) : null;
  const [user, setUser] = useState<UserProfile | null>(cachedData);
  const [isFetching, setIsFetching] = useState(cachedData === null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchProfileData = useCallback(async (isRefresh = false) => {
    if (!userId) return;

    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsFetching(true);
    }

    const response = await api.get<UserProfile>(`/users/${userId}`);

    if (response.status !== 200) {
      Alert.alert("Nao foi possivel carregar esse perfil.");
      setIsFetching(false);
      setIsRefreshing(false);
      return;
    }

    const profileData: UserProfile = response.data;
    profileCache.set(userId, { data: profileData, cachedAt: Date.now() });
    setUser(profileData);
    setIsFetching(false);
    setIsRefreshing(false);

    addRecent({
      id: profileData.id,
      name: profileData.name,
      username: profileData.username,
      image: profileData.image,
    });
  }, [userId, addRecent]);

  const handleRefresh = useCallback(() => {
    fetchProfileData(true);
  }, [fetchProfileData]);

  useFocusEffect(useCallback(() => {
    if (!getCached(userId)) {
      fetchProfileData(false);
    }
  }, [fetchProfileData, userId]));

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

  const handleFollowChange = useCallback(() => {
    invalidateProfileCache(userId);
  }, [userId]);

  return (
    <ProfileView
      user={user}
      onBack={handleBack}
      refreshing={isRefreshing}
      onRefresh={handleRefresh}
      onFollowChange={handleFollowChange}
    />
  );
}
