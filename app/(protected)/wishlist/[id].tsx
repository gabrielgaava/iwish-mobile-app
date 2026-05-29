import { CustomButton, LinkButton } from "@/components/buttons";
import IconButton from "@/components/buttons/IconButton";
import EmptyState from "@/components/empty-state";
import { Txt } from "@/components/ui/text";
import WishDetailSheet from "@/components/wish/WishDetailSheet";
import WishCard from "@/components/wish/wish-card";
import WishlistOptionsSheet from "@/components/wishlist/WishlistOptionsSheet";
import { useAuth } from "@/hooks/useAuth";
import { useWishlistDetail } from "@/hooks/useWishlistDetail";
import { Wish } from "@/types/User";
import { normalizeImageUri } from "@/utils/format";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useTheme } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  BackHandler,
  RefreshControl,
  Share,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styled from "styled-components/native";

export const HEADER_HEIGHT = 340;
const STICKY_HEADER_HEIGHT = 56;

type WishlistPageParams = {
  id: string;
  from?: string;
  forceRefresh?: string;
};

export default function WishlistPage() {
  const { id, from, forceRefresh } = useLocalSearchParams<WishlistPageParams>();
  const { colors } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const sheetRef = useRef<BottomSheetModal>(null);
  const sheetOptions = useRef<BottomSheetModal>(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  const {
    data,
    isFetching,
    isRefreshing,
    isUpdating,
    selectedWish,
    setSelectedWish,
    getWishlistDetails,
    deleteWish,
    markPurchased,
    deleteWishlist,
    handleBack,
  } = useWishlistDetail({ id, from, forceRefresh });

  const isOwner = useMemo(
    () => user?.id === data?.user_id,
    [user?.id, data?.user_id]
  );

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          handleBack();
          return true;
        }
      );
      return () => subscription.remove();
    }, [handleBack])
  );

  /* Animated interpolations */
  const headerImageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - STICKY_HEADER_HEIGHT],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const stickyHeaderOpacity = scrollY.interpolate({
    inputRange: [HEADER_HEIGHT * 0.45, HEADER_HEIGHT - STICKY_HEADER_HEIGHT],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const headerImageTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -40],
    extrapolate: "clamp",
  });

  function openWishDetail(wish: Wish) {
    setSelectedWish(wish);
    sheetRef.current?.present();
  }

  function goToCreate() {
    router.push({
      pathname: "/(protected)/wish/create",
      params: { wishlistId: data?.id },
    });
  }

  const handleEditWish = useCallback((wish: Wish) => {
    router.push({
      pathname: "/(protected)/wish/edit",
      params: {
        id: wish.id,
        wishlistId: data?.id ?? "",
        title: wish.title ?? "",
        price: wish.price != null ? String(wish.price) : "",
        link: wish.link ?? "",
        notes: wish.notes ?? "",
        mostWanted: String(wish.most_wanted),
        images: JSON.stringify(wish.images?.map((img) => img.url) ?? []),
      },
    });
  }, [data?.id]);

  function editWishlist() {
    router.push({
      pathname: "/(protected)/wishlist/create",
      params: {
        id: data?.id,
        name: data?.name,
        description: data?.description,
        isPublic: String(data?.is_public),
        coverImage: data?.cover_image,
      },
    });
  }

  async function shareWishlist() {
    const domain = process.env.DOMAIN;

    await Share.share({
      message: `Veja minha wishlist no Wishhub 🎁 ${domain}/wishlist/${data?.id}`,
    });
  }

  if (isFetching) {
    return (
      <LoadingScreen>
        <ActivityIndicator size="large" />
      </LoadingScreen>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <StickyHeader style={{ opacity: stickyHeaderOpacity }}>
        <StickyHeaderContent style={{ paddingTop: insets.top }}>
          <IconButton
            icon={<Feather name="arrow-left" size={22} color={colors.icon} />}
            onPress={handleBack}
            backgroundColor="transparent"
          />
          <Txt text={data?.name || "Detalhes da Lista"} weight="bold" size={18} />
          <IconButton
            icon={<MaterialIcons name="share" size={22} color={colors.icon} />}
            onPress={() => {}}
            backgroundColor="transparent"
          />
        </StickyHeaderContent>
      </StickyHeader>

      <HeaderButtonsOverlay
        pointerEvents="box-none"
        style={{ paddingTop: insets.top + 16, opacity: headerImageOpacity }}
      >
        <ButtonContainer>
          <CustomButton
            height={36}
            text=""
            onPress={handleBack}
            variant="glass"
            color={colors.white}
            icon={<Feather name="arrow-left" size={22} color={colors.white} />}
          />
        </ButtonContainer>
        {isOwner && (
          <ButtonContainer style={{ width: 36 }}>
            <CustomButton
              height={36}
              text=""
              onPress={() => sheetOptions.current?.present()}
              variant="glass"
              color={colors.white}
              icon={<Feather name="settings" size={20} color={colors.white} />}
            />
          </ButtonContainer>
        )}
        {!isOwner && (
          <ButtonContainer style={{ width: 36 }}>
            <CustomButton
              height={36}
              text=""
              onPress={() => shareWishlist()}
              variant="glass"
              color={colors.white}
              icon={<Feather name="share-2" size={20} color={colors.white} />}
            />
          </ButtonContainer>
        )}
      </HeaderButtonsOverlay>

      <Animated.ScrollView
        style={{ flex: 1, backgroundColor: colors.darkBackground }}
        contentContainerStyle={{ paddingBottom: 112 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => getWishlistDetails(true)}
          />
        }
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        <HeaderContainer>
          <BackgroundImage
            source={{ uri: normalizeImageUri(data?.cover_image) }}
            resizeMode="cover"
            style={{
              opacity: headerImageOpacity,
              transform: [{ translateY: headerImageTranslateY }],
            }}
          />
          <Overlay style={{ opacity: headerImageOpacity }}>
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.82)"]}
              style={{ flex: 1 }}
            />
          </Overlay>
          <HeaderDetails style={{ opacity: headerImageOpacity }}>
            <HeaderTitleColumn>
              <HeaderBadge>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <Ionicons name="gift" size={12} color={colors.white} />
                  <Txt
                    text={`${data?.wishes.length} itens`}
                    color={colors.white}
                    size={12}
                  />
                </View>
              </HeaderBadge>
              <Txt
                text={data?.name}
                weight="bold"
                size={28}
                align="left"
                color={colors.white}
              />
              <Txt
                text={data?.description}
                maxLength={92}
                size={16}
                align="left"
                weight="semi"
                color={colors.white70}
              />
            </HeaderTitleColumn>
          </HeaderDetails>
        </HeaderContainer>

        <SectionHeader>
          <Row>
            <Txt text="Itens Desejados" weight="regular" size={18} align="left" />
            <LinkButton text="Ordernar" onPress={() => {}} contrast />
          </Row>
        </SectionHeader>

        {isOwner && data?.wishes.length === 0 && (
          <EmptyState type="wish" showButton onButtonPress={goToCreate} />
        )}

        {!isOwner && data?.wishes.length === 0 && (
          <EmptyState type="publicWishlist" />
        )}

        {data && data.wishes.length > 0 && (
          <ItensGrid>
            {data.wishes.map((wish) => (
              <WishCard
                key={wish.id}
                wish={wish}
                isOwner={isOwner}
                onPress={() => openWishDetail(wish)}
              />
            ))}
          </ItensGrid>
        )}
      </Animated.ScrollView>

      <WishlistOptionsSheet
        sheetRef={sheetOptions}
        onShare={shareWishlist}
        onEdit={editWishlist}
        onAddItem={goToCreate}
        onDelete={() => data && deleteWishlist(data.id)}
      />

      <WishDetailSheet
        sheetRef={sheetRef}
        wish={selectedWish}
        isOwner={isOwner}
        isUpdating={isUpdating}
        userId={user?.id}
        onDelete={deleteWish}
        onMarkPurchased={markPurchased}
        onEdit={handleEditWish}
      />
    </View>
  );
}

export const HeaderContainer = styled.View`
  height: ${HEADER_HEIGHT}px;
  position: relative;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
`;

export const BackgroundImage = styled(Animated.Image)`
  position: absolute;
  width: 100%;
  height: 100%;
`;

export const Overlay = styled(Animated.View)`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
`;

const HeaderButtonsOverlay = styled(Animated.View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
  z-index: 30;
`;

const HeaderDetails = styled(Animated.View)`
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 32px;
  z-index: 2;
`;

const HeaderTitleColumn = styled.View`
  flex-direction: column;
  flex: 1;
`;

const HeaderBadge = styled.View`
  padding: 6px 12px;
  border-radius: 12px;
  max-width: 86px;
  background-color: rgba(255, 255, 255, 0.22);
  justify-content: center;
  align-items: center;
  margin-bottom: 6px;
`;

const StickyHeader = styled(Animated.View)`
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  min-height: ${STICKY_HEADER_HEIGHT}px;
  background-color: ${({ theme }) => theme.colors.background};
  border-bottom-width: 1px;
  border-color: ${({ theme }) => theme.colors.defaultBorder};
  z-index: 20;
`;

const StickyHeaderContent = styled.View`
  min-height: ${STICKY_HEADER_HEIGHT}px;
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 16px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const SectionHeader = styled.View`
  margin-top: 18px;
  margin-bottom: 12px;
  padding-left: 20px;
  padding-right: 20px;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const ItensGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  padding-left: 20px;
  padding-right: 20px;
  gap: 12px;
`;

const ButtonContainer = styled.View`
  width: 36px;
`;

const LoadingScreen = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
