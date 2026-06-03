import SearchInput from "@/components/search";
import { TabScrollView } from "@/components/ui/tab-scroll-view";
import { Txt } from "@/components/ui/text";
import { images } from "@/constants/images";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import { api } from "@/lib/api";
import { UserSearchResponse } from "@/types/User";
import { normalizeImageUri } from "@/utils/format";
import Feather from "@expo/vector-icons/Feather";
import { useTheme } from "@react-navigation/native";
import { Image } from "expo-image";
import { router, usePathname } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

export default function SearchPage() {
  const { recents, clearRecents } = useRecentSearches();
  const { colors } = useTheme();
  const pathname = usePathname();

  const [query, setQuery] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [users, setUsers] = useState<UserSearchResponse[]>([]);

  const handleSearch = useCallback(async (text: string) => {
    setQuery(text);
    if (!text) return setUsers([]);

    setIsFetching(true);
    const { data } = await api.get(`/users?query=${text}`);
    setUsers(data ?? []);
    setIsFetching(false);
  }, []);

  function goToProfile(userId: string) {
    router.push({
      pathname: "/(protected)/users/[userId]",
      params: { userId, from: pathname },
    });
  }

  const toggleFollowingById = useCallback((userId: string, value: boolean) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isFollowing: value } : u))
    );
  }, []);

  async function handleFollowToggle(userId: string, isFollowing: boolean) {
    toggleFollowingById(userId, !isFollowing);

    const response = isFollowing
      ? await api.delete(`/users/${userId}/follow`)
      : await api.post(`/users/${userId}/follow`);

    if (![200, 201, 204].includes(response.status)) {
      toggleFollowingById(userId, isFollowing);
    }
  }

  const hasQuery = query.length > 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.darkBackground }}>
      <TabScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <PageContent>
          <SearchInput
            onValueChange={handleSearch}
            placeholder="Buscar amigos ou listas..."
          />

          {/* ── Resultados de busca ──────────────────────────── */}
          {hasQuery && (
            <View style={{ gap: 8 }}>
              {isFetching && <ActivityIndicator color={colors.primary} />}
              {!isFetching && users.length === 0 && (
                <Txt
                  text={`Nenhum resultado encontrado para "${query}".`}
                  size={14}
                  color={colors.text70}
                  align="center"
                />
              )}
              {users.map((user) => {
                const { isFollowing } = user;
                const subtitle = user.username ? `@${user.username}` : user.email;

                return (
                  <SearchResultRow
                    key={user.id}
                    activeOpacity={0.7}
                    onPress={() => goToProfile(user.id)}
                    style={{ borderColor: colors.border }}
                  >
                    <ResultAvatar
                      source={
                        user.image
                          ? normalizeImageUri(user.image)
                          : images.avatarPlaceholder
                      }
                    />
                    <ResultInfo>
                      <Txt text={user.name} align="left" weight="semi" size={15} />
                      <Txt text={subtitle} align="left" size={13} color={colors.text70} />
                    </ResultInfo>
                    <FollowButton
                      activeOpacity={0.8}
                      isFollowing={isFollowing}
                      onPress={() => handleFollowToggle(user.id, isFollowing)}
                      style={{
                        backgroundColor: isFollowing ? colors.altBackground : "transparent",
                      }}
                    >
                      <Txt
                        text={isFollowing ? "Seguindo" : "Seguir"}
                        size={13}
                        weight="semi"
                        color={isFollowing ? colors.text70 : colors.primary}
                      />
                    </FollowButton>
                  </SearchResultRow>
                );
              })}
            </View>
          )}

          {/* ── Estado vazio (sem query) ─────────────────────── */}
          {!hasQuery && (
            <>
              {/* Recentes */}
              {recents.length > 0 && (
                <Section>
                  <SectionHeader>
                    <Txt text="Recentes" weight="bold" size={18} align="left" />
                    <TouchableOpacity onPress={clearRecents} activeOpacity={0.7}>
                      <Txt text="Limpar tudo" size={14} color={colors.primary} />
                    </TouchableOpacity>
                  </SectionHeader>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 20, paddingVertical: 4 }}
                  >
                    {recents.map((recent) => (
                      <TouchableOpacity
                        key={recent.id}
                        activeOpacity={0.8}
                        onPress={() => goToProfile(recent.id)}
                        style={{ alignItems: "center", gap: 6 }}
                      >
                        <RecentAvatar
                          source={
                            recent.image
                              ? normalizeImageUri(recent.image)
                              : images.avatarPlaceholder
                          }
                          style={{ borderColor: colors.border }}
                        />
                        <Txt
                          text={recent.name.split(" ")[0]}
                          size={12}
                          color={colors.text}
                        />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </Section>
              )}

              {/* Empty state */}
              {recents.length === 0 && (
                <EmptyState>
                  <EmptyIconBox style={{ backgroundColor: colors.duotoneBackground }}>
                    <Feather name="users" size={32} color={colors.primary} />
                  </EmptyIconBox>
                  <Txt
                    text="Encontre seus amigos"
                    weight="bold"
                    size={17}
                    align="center"
                  />
                  <Txt
                    text={"Encontre amigos pelo nome ou e-mail e descubra suas listas de desejos."}
                    size={14}
                    color={colors.text70}
                    align="center"
                  />
                </EmptyState>
              )}
            </>
          )}
        </PageContent>
      </TabScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const PageContent = styled.View`
  padding: 16px 20px 0px;
  gap: 24px;
`;

const Section = styled.View`
  gap: 14px;
`;

const SectionHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const RecentAvatar = styled(Image)`
  width: 58px;
  height: 58px;
  border-radius: 29px;
  border-width: 1.5px;
`;

const SearchResultRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 14px;
  border-width: 1px;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ResultAvatar = styled(Image)`
  width: 44px;
  height: 44px;
  border-radius: 22px;
`;

const ResultInfo = styled.View`
  flex: 1;
  gap: 2px;
`;

const FollowButton = styled.TouchableOpacity<{ isFollowing: boolean }>`
  padding: 7px 16px;
  border-radius: 20px;
`;

const EmptyState = styled.View`
  align-items: center;
  gap: 10px;
  padding: 48px 24px;
`;

const EmptyIconBox = styled.View`
  width: 72px;
  height: 72px;
  border-radius: 36px;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
`;

