import WishlistCard from "@/components/wishlist-card";
import { images } from "@/constants/images";
import i18n from "@/constants/region";
import { api } from "@/lib/api";
import { UserProfile, Wishlist } from "@/types/User";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "@react-navigation/native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Alert, RefreshControl, View } from "react-native";
import styled from "styled-components/native";
import EmptyState from "../empty-state";
import BackHeader from "../ui/back-header";
import { ScrollScreen } from "../ui/screen";
import { Txt } from "../ui/text";

type ProfileViewProps = {
  user: UserProfile;
  isOwnProfile?: boolean;
  onBack?: () => void;
  onEditProfile?: () => void;
  onWishlistOptions?: (wishlist: Wishlist) => void;
  /** Padding extra no rodapé — use TAB_BAR_SCROLL_INSET em telas dentro de tabs */
  bottomSpacing?: number;
  refreshing?: boolean;
  onRefresh?: () => void;
};

export function ProfileView({
  user,
  isOwnProfile = false,
  onBack,
  onEditProfile,
  onWishlistOptions,
  bottomSpacing = 0,
  refreshing = false,
  onRefresh,
}: ProfileViewProps) {
  const { colors } = useTheme();
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);
  const [followerCount, setFollowerCount] = useState(user.followers?.length ?? 0);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  const handleFollow = useCallback(async () => {
    setIsFollowing(true);
    setFollowerCount((prev) => prev + 1);

    const response = await api.post(`/users/${user.id}/follow`);

    if (response.status !== 200 && response.status !== 201) {
      setIsFollowing(false);
      setFollowerCount((prev) => prev - 1);
      Alert.alert("Erro", "Não foi possível seguir este usuário.");
    }
  }, [user.id]);

  const handleUnfollow = useCallback(async () => {
    setIsFollowLoading(true);
    setIsFollowing(false);
    setFollowerCount((prev) => prev - 1);

    const response = await api.delete(`/users/${user.id}/follow`);

    if (response.status !== 200 && response.status !== 204) {
      setIsFollowing(true);
      setFollowerCount((prev) => prev + 1);
      Alert.alert("Erro", "Não foi possível deixar de seguir este usuário.");
    }

    setIsFollowLoading(false);
  }, [user.id]);

  const wishlistCount = useMemo(() => user.wishlists?.length ?? 0, [user.wishlists]);
  const followingCount = useMemo(() => user.followings?.length ?? 0, [user.followings]);


  const sectionTitle = useMemo(
    () =>
      isOwnProfile
        ? i18n.t("profile.myWishlists")
        : i18n.t("profile.userWishlists", { name: user.name.split(" ")[0] }),
    [isOwnProfile, user.name]
  );

  const refreshControl = useMemo(
    () =>
      onRefresh ? (
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      ) : undefined,
    [refreshing, onRefresh, colors.primary]
  );

  return (
    <ScrollScreen indicator={false} bottomSpacing={bottomSpacing} refreshControl={refreshControl}>

      <View style={{ paddingHorizontal: 24 }}>
        <BackHeader />
      </View>

      {/* Avatar with overlay */}
      <AvatarWrapper isPublicProfile={!isOwnProfile}>
        <AvatarContainer>
          <Avatar source={user.image || images.avatarPlaceholder} />
          {isOwnProfile && (
            <EditAvatarButton onPress={onEditProfile} activeOpacity={0.8}>
              <MaterialCommunityIcons name="pencil" size={14} color="#fff" />
            </EditAvatarButton>
          )}
          {!isOwnProfile && (
          <FollowPill>
            {isFollowing ? (
              <FollowButton onPress={handleUnfollow}>
                <Feather name="check" color={colors.background} />
                <Txt text={i18n.t("profile.unfollow")} color={colors.background}/>
              </FollowButton>
            ) : (
              <FollowButton onPress={handleFollow}>
                <Txt text={i18n.t("profile.follow")} color={colors.background}/>
              </FollowButton>
            )}
          </FollowPill>
        )}
        </AvatarContainer>
      </AvatarWrapper>

      {/* Profile info */}
      <ProfileBody>
        <Txt text={user.name} weight="semi" size={20} align="center" />
        {isOwnProfile && (
          <Txt text={user.email} weight="regular" size={13} color={colors.text70} align="center" />
        )}
        <Txt text={"@" + user.username} weight="regular" size={14} color={colors.text70} align="center" />

        {/* Stats — shown in both profiles */}
        <StatsRow>
          <StatColumn>
            <Txt text={String(followerCount)} weight="bold" size={18} align="center" color={colors.primary} />
            <Txt text={i18n.t("profile.followers")} size={11} color={colors.text70} align="center" />
          </StatColumn>
          <StatDivider />
          <StatColumn>
            <Txt text={String(followingCount)} weight="bold" size={18} align="center" color={colors.primary} />
            <Txt text={i18n.t("profile.following")} size={11} color={colors.text70} align="center" />
          </StatColumn>
          <StatDivider />
          <StatColumn>
            <Txt text={String(wishlistCount)} weight="bold" size={18} align="center" color={colors.primary} />
            <Txt text={i18n.t("profile.wishlists")} size={11} color={colors.text70} align="center" />
          </StatColumn>
        </StatsRow>
      </ProfileBody>

      {/* Wishlists section */}
      <ListSection>
        <ListHeader>
          <Txt text={sectionTitle} weight="semi" size={16} />
        </ListHeader>

        {wishlistCount === 0 && isOwnProfile 
          && <EmptyState type="wishlist" showButton onButtonPress={() => router.navigate("/wishlist/create")}/>
        }
        {wishlistCount === 0 && !isOwnProfile && <EmptyState type="publicWishlist" />}

        {!!wishlistCount && (
          <WishlistsContainer>
            {user.wishlists.map((item) => (
              <WishlistCard
                key={item.id}
                wishlist={item}
                width="100"
                showBadges={isOwnProfile}
                onClick={() => {}}
                onOptionsPress={isOwnProfile ? onWishlistOptions : undefined}
              />
            ))}
          </WishlistsContainer>
        )}
      </ListSection>

    </ScrollScreen>
  );
}

// ─── Constants ───────────────────────────────────────────────────────────────

const AVATAR_SIZE = 110;
const EDIT_BUTTON_SIZE = 28;

// ─── Styled Components ────────────────────────────────────────────────────────

const AvatarWrapper = styled.View<{ isPublicProfile: boolean }>`
  align-items: center;
  z-index: 1;
  margin-bottom: ${({ isPublicProfile }) => (isPublicProfile ? 18 : 0)}px;
`;

const AvatarContainer = styled.View`
  position: relative;
  width: ${AVATAR_SIZE}px;
  align-items: center;
`;

const Avatar = styled(Image)`
  width: ${AVATAR_SIZE}px;
  height: ${AVATAR_SIZE}px;
  border-radius: ${AVATAR_SIZE / 2}px;
  border-width: 3px;
  border-color: ${({ theme }) => theme.colors.background};
`;

const EditAvatarButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: ${EDIT_BUTTON_SIZE}px;
  height: ${EDIT_BUTTON_SIZE}px;
  border-radius: ${EDIT_BUTTON_SIZE / 2}px;
  background-color: ${({ theme }) => theme.colors.primary};
  align-items: center;
  justify-content: center;
  border-width: 2px;
  border-color: ${({ theme }) => theme.colors.background};
`;

const FollowPill = styled.View`
  position: absolute;
  bottom: -10px;
`;

const FollowButton = styled.TouchableOpacity`
  background: ${p => p.theme.colors.primary};
  padding: 4px 8px;
  border-radius: 16px;
  border: solid 2px ${p => p.theme.colors.background};
  height: 36px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const ProfileBody = styled.View`
  align-items: center;
  padding: 0px 24px 0;
  gap: 4px;
`;

const StatsRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 28px;
  margin-top: 20px;
  padding: 14px 20px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.darkBackground};
  width: 100%;
`;

const StatColumn = styled.View`
  flex: 1;
  align-items: center;
  gap: 2px;
`;

const StatDivider = styled.View`
  width: 1px;
  height: 28px;
  background-color: ${({ theme }) => theme.colors.border};
`;

const ListSection = styled.View`
  flex: 1;
  margin-top: 24px;
  padding: 0 16px 24px;
`;

const ListHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  padding-left: 12px;
  padding-right: 12px;
`;

const WishlistsContainer = styled.View`
  gap: 12px;
`;

