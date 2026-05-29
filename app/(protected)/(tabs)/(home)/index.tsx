import { LinkButton } from "@/components/buttons";
import { FeedItem } from "@/components/feed";
import { TabScrollView } from "@/components/ui/tab-scroll-view";
import { Txt } from "@/components/ui/text";
import { images } from "@/constants/images";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { FeedResponse } from "@/types/Feed";
import { normalizeImageUri } from "@/utils/format";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { useCreateWish } from "@/hooks/useCreateWish";
import { router } from "expo-router";
import { ActivityIndicator, RefreshControl, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

export default function HomeScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const { setPrefill } = useCreateWish();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [feed, setFeed] = useState<FeedResponse | null>(null);
  const [importLink, setImportLink] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  async function fetchFeedData() {
    const response = await api.get("/feed");
    if (response.status !== 200) return;
    setFeed(response.data);
  }

  async function handleRefresh() {
    setIsRefreshing(true);
    await fetchFeedData();
    setIsRefreshing(false);
  }

  useEffect(() => {
    fetchFeedData();
  }, []);

  async function handleImport() {
    const url = importLink.trim();
    if (!url) return;

    setIsImporting(true);
    const response = await api.post("/wish/scrap", { url });
    setIsImporting(false);
    setImportLink("");

    setPrefill({
      link: url,
      title: response.data?.title || "",
      price: response.data?.price?.toFixed(2) || "",
      images: response.data?.images || [],
    });

    router.push("/(protected)/wish/create");
  }

  const firstName = user?.name.split(" ")[0] ?? "";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.darkBackground }}>
      <TabScrollView
        style={{ backgroundColor: colors.darkBackground }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        <PageContent>

          <HomeHeader>
            <HeaderLeft>
              <UserAvatar
                source={
                  user?.image
                    ? normalizeImageUri(user.image)
                    : images.avatarPlaceholder
                }
              />
              <Text style={{ fontSize: 20, color: colors.text }}>
                <Text style={{ fontFamily: "PlusJakartaSans_700Bold" }}>
                  {"Olá, " + firstName}
                </Text>
                {"  👋"}
              </Text>
            </HeaderLeft>
            <TouchableOpacity activeOpacity={0.7}>
              <BellWrapper>
                <Ionicons name="notifications-outline" size={22} color={colors.text} />
              </BellWrapper>
            </TouchableOpacity>
          </HomeHeader>

          <ImportRow style={{ borderColor: colors.border, backgroundColor: colors.background }}>
            <ImportInputArea>
              <Feather name="link" size={16} color={colors.text70} />
              <TextInput
                value={importLink}
                onChangeText={setImportLink}
                placeholder="Cole o link do produto"
                placeholderTextColor={colors.text70}
                style={{
                  flex: 1,
                  fontSize: 14,
                  color: colors.text,
                  fontFamily: "PlusJakartaSans_400Regular",
                }}
              />
            </ImportInputArea>
            <ImportButton
              activeOpacity={0.85}
              onPress={handleImport}
              disabled={isImporting || !importLink.trim()}
              style={{ backgroundColor: colors.primary, opacity: isImporting || !importLink.trim() ? 0.6 : 1 }}
            >
              {isImporting
                ? <ActivityIndicator size={14} color={colors.white} />
                : <Ionicons name="send" color={colors.white} size={14} />
              }
            </ImportButton>
          </ImportRow>

          <SectionHeader>
            <Txt text="Atividade dos amigos" weight="bold" size={18} align="left" />
            <LinkButton text="Ver tudo" onPress={() => {}} contrast />
          </SectionHeader>

          {feed?.data.length === 0 && (
            <EmptyFeed>
              <Ionicons name="people-outline" size={40} color={colors.text70} />
              <Txt
                text="Nenhuma atividade ainda."
                size={15}
                color={colors.text70}
                align="center"
              />
              <Txt
                text="Siga amigos para ver o que eles estão desejando."
                size={13}
                color={colors.text70}
                align="center"
              />
            </EmptyFeed>
          )}

          <View>
            {feed?.data.map((item) => (
              <FeedItem key={item.id} data={item} />
            ))}
          </View>

        </PageContent>
      </TabScrollView>
    </SafeAreaView>
  );
}

const PageContent = styled.View`
  padding: 16px 20px 32px;
  gap: 16px;
`;

const HomeHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const HeaderLeft = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const UserAvatar = styled(Image)`
  width: 40px;
  height: 40px;
  border-radius: 20px;
`;

const BellWrapper = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  justify-content: center;
  align-items: center;
`;

const ImportRow = styled.View`
  flex-direction: row;
  align-items: center;
  border-width: 1px;
  border-radius: 12px;
  padding: 6px 6px 6px 14px;
  gap: 8px;
`;

const ImportInputArea = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const ImportButton = styled.TouchableOpacity`
  border-radius: 8px;
  padding: 12px;
  justify-content: center;
  align-items: center;
`;

const SectionHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const EmptyFeed = styled.View`
  align-items: center;
  gap: 8px;
  padding: 40px 20px;
`;
