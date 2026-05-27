import { Txt } from "@/components/ui/text";
import { images } from "@/constants/images";
import i18n from "@/constants/region";
import { normalizeImageUri } from "@/utils/format";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "@react-navigation/native";
import { router, usePathname } from "expo-router";
import { useCallback } from "react";
import { TouchableOpacity } from "react-native";
import { BadgeContainer, CardContainer, CardInfo, CardTextGroup, CoverImg, ImageContainer, TouchContainer } from "./styles";
import { WishlistCardProps } from "./wishlist-card";

export default function WishlistCard({ wishlist, width, showBadges, onOptionsPress }: WishlistCardProps) {
  const pathname = usePathname();
  const { colors } = useTheme();

  const goToWishlistPage = useCallback(() => {
    router.push({
      pathname: "/wishlist/[id]",
      params: { id: wishlist.id, from: pathname },
    });
  }, [wishlist.id, pathname]);

  const handleOptions = useCallback(() => {
    onOptionsPress?.(wishlist);
  }, [wishlist, onOptionsPress]);

  const isPrivate = !wishlist.is_public;

  return (
    <TouchContainer onPress={goToWishlistPage} activeOpacity={0.85} width={width}>
      <CardContainer>
        <ImageContainer>
          <CoverImg source={normalizeImageUri(wishlist.cover_image) || images.coverPlaceholder} />
          {showBadges && isPrivate && (
            <BadgeContainer color={colors.background}>
              <Feather name="lock" size={12} color={colors.text} />
              <Txt text={i18n.t("profile.private")} size={11} weight="semi" />
            </BadgeContainer>
          )}
          {showBadges && !isPrivate && (
            <BadgeContainer color={colors.darkBackground}>
              <Feather name="globe" size={12} color={colors.text} />
              <Txt text={i18n.t("profile.public")} size={11} weight="semi" />
            </BadgeContainer>
          )}
        </ImageContainer>
        <CardInfo>
          <CardTextGroup>
            <Txt text={wishlist.name} weight="semi" />
            <Txt text={`${wishlist.wishes.length} itens`} size={13} color={colors.text70} />
          </CardTextGroup>
          {!!onOptionsPress && (
            <TouchableOpacity onPress={handleOptions} hitSlop={8}>
              <MaterialCommunityIcons name="dots-vertical" size={20} color={colors.text70} />
            </TouchableOpacity>
          )}
        </CardInfo>
      </CardContainer>
    </TouchContainer>
  );
}
