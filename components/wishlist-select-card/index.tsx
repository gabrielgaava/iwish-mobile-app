import { Image } from "expo-image";
import Feather from "@expo/vector-icons/Feather";
import { useCallback } from "react";
import styled, { useTheme } from "styled-components/native";
import { Txt } from "@/components/ui/text";
import { Wishlist } from "@/types/User";
import { normalizeImageUri } from "@/utils/format";
import { images } from "@/constants/images";
import i18n from "@/constants/region";

type WishlistSelectCardProps = {
  wishlist: Wishlist;
  selected: boolean;
  onSelect: (id: string) => void;
};

export function WishlistSelectCard({
  wishlist,
  selected,
  onSelect,
}: WishlistSelectCardProps) {
  const { colors } = useTheme();

  const handlePress = useCallback(() => onSelect(wishlist.id), [wishlist.id, onSelect]);

  const count = wishlist.wishes?.length ?? 0;
  const countLabel = count === 1
    ? i18n.t("wish.create.itemCountSingle", { count })
    : i18n.t("wish.create.itemCount", { count });

  const coverSource = normalizeImageUri(wishlist.cover_image) || images.coverPlaceholder;

  return (
    <CardRow onPress={handlePress} activeOpacity={0.75} selected={selected}>
      <Thumbnail source={coverSource} contentFit="cover" />
      <TextGroup>
        <Txt text={wishlist.name} weight="semi" size={15} align="left" />
        <Txt text={countLabel} size={13} color={colors.text70} align="left" />
      </TextGroup>
      {selected && (
        <Feather name="check-circle" size={20} color={colors.primary} />
      )}
    </CardRow>
  );
}

const CardRow = styled.TouchableOpacity<{ selected: boolean }>`
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  border-width: 1.5px;
  border-color: ${({ theme, selected }) =>
    selected ? theme.colors.primary : theme.colors.defaultBorder};
  background-color: ${({ theme }) => theme.colors.background};
`;

const Thumbnail = styled(Image)`
  width: 56px;
  height: 56px;
  border-radius: 8px;
`;

const TextGroup = styled.View`
  flex: 1;
  gap: 2px;
`;
