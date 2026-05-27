import { images } from "@/constants/images";
import { FeedItem as FeedItemType } from "@/types/Feed";
import { getRelativeTime, limitText, normalizeImageUri, toPrice } from "@/utils/format";
import { useTheme } from "@react-navigation/native";
import { router, usePathname } from "expo-router";
import { Text } from "react-native";
import { BorderButton } from "../buttons";
import { Txt } from "../ui/text";
import {
  Card,
  CoverImage,
  CoverOverlay,
  DetailsButtonWrapper,
  HeaderTextColumn,
  ItemHeader,
  UserAvatar,
  WishDetails,
  WishImage,
  WishlistCover,
  WishRow,
} from "./style";

type FeedItemProps = {
  data: FeedItemType;
};

function getStoreName(link?: string): string {
  if (!link) return "";
  try {
    return new URL(link).hostname.replace("www.", "");
  } catch {
    return "";
  }
}

export default function FeedItem({ data }: FeedItemProps) {
  const { colors } = useTheme();
  const pathname = usePathname();

  const actionText =
    data.type === "wishlist_created" ? "criou uma lista" : "adicionou um desejo";

  return (
    <Card style={{ paddingBottom: data.type === "wish_added" ? 16 : 0 }}>
      <ItemHeader>
        <UserAvatar
          source={
            data.user.image
              ? normalizeImageUri(data.user.image)
              : images.avatarPlaceholder
          }
        />
        <HeaderTextColumn>
          <Text style={{ fontSize: 14, color: colors.text, lineHeight: 20 }}>
            <Text style={{ fontFamily: "PlusJakartaSans_700Bold" }}>
              @{data.user.username}
            </Text>
            {" " + actionText}
          </Text>
          <Txt
            text={getRelativeTime(data.createdAt)}
            align="left"
            size={12}
            color={colors.text70}
          />
        </HeaderTextColumn>
      </ItemHeader>

      {data.type === "wishlist_created" && data.wishlist && (
        <WishlistCover
          activeOpacity={0.9}
          onPress={() =>
            router.push({
              pathname: "/(protected)/wishlist/[id]",
              params: { id: data.wishlist!.id, from: pathname },
            })
          }
        >
          <CoverImage
            source={normalizeImageUri(data.wishlist.cover_image) || images.coverPlaceholder}
            contentFit="cover"
          />
          <CoverOverlay>
            <Txt
              text={data.wishlist.name}
              weight="bold"
              size={18}
              color={colors.white}
              align="left"
            />
            <Txt
              text={`${data.wishlist.wishes?.length ?? 0} itens na lista`}
              size={13}
              color={colors.white70}
              align="left"
            />
          </CoverOverlay>
        </WishlistCover>
      )}

      {data.type === "wish_added" && data.wish && (
        <>
          <WishRow>
            <WishImage
              source={normalizeImageUri(data.wish.images?.[0]?.url) || images.coverPlaceholder}
              contentFit="cover"
            />
            <WishDetails>
              <Txt
                text={limitText(data.wish.title, 50)}
                align="left"
                weight="semi"
                size={15}
              />
              <Txt
                text={toPrice(data.wish.price)}
                align="left"
                weight="bold"
                size={14}
                color={colors.primary}
              />
              <Txt
                text={getStoreName(data.wish.link)}
                align="left"
                size={12}
                color={colors.text70}
              />
            </WishDetails>
          </WishRow>
          <DetailsButtonWrapper>
            <BorderButton text="Ver Detalhes" onPress={() => {}} />
          </DetailsButtonWrapper>
        </>
      )}
    </Card>
  );
}
