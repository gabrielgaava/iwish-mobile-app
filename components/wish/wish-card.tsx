import { images } from "@/constants/images";
import i18n from "@/constants/region";
import { useAuth } from "@/hooks/useAuth";
import { Wish } from "@/types/User";
import { limitText, normalizeImageUri, toPrice } from "@/utils/format";
import Feather from "@expo/vector-icons/Feather";
import { useTheme } from "@react-navigation/native";
import { useMemo } from "react";
import styled from "styled-components/native";
import ImageBox from "../image-box";
import { Txt } from "../ui/text";

type WishCardProps = {
  wish: Wish;
  isOwner: boolean;
  onPress: (data: Wish) => void;
}

export default function WishCard({ wish, isOwner, onPress }: WishCardProps) {
  const { colors } = useTheme();
  const { user } = useAuth();

  const wasPurchasedByUser = useMemo(() => {
    return (
      !!wish.purchased_by
      && !!user?.id
      && wish.purchased_by === user.id
    );
  }, [wish, user])

  const imageSource = useMemo(() => {
    const uri = normalizeImageUri(wish?.images[0]?.url);
    return uri ? { uri } : images.coverPlaceholder;
  }, [wish?.images]);

  return (
    <WishContainer key={wish.id} onPress={() => onPress(wish)}>
      <ImageContaier>
        <WishImage
          source={imageSource}
          contentFit="cover"
        />
        {!isOwner && wish.was_purchased && <Reserved byUser={wasPurchasedByUser} />}
        {wish.most_wanted && <MostWanted />}
      </ImageContaier>

      <TextGroup>
        <Txt text={limitText(wish.title, 40)} align="left" size={16}/>
        <Txt text={`R$ ${toPrice(wish.price)}`} align="left" size={12} weight="semi" color={colors.text70} />
      </TextGroup>
    </WishContainer>
  )
}

function Reserved({byUser}: {byUser: boolean}) {
  const { colors } = useTheme();
  const text = byUser ? i18n.t("wish.youReserved") : i18n.t("wish.reserved");

  return (
    <Badge>
      <Feather name="lock" color={colors.text70} />
      <Txt text={text} size={12} color={colors.text70} />
    </Badge>
  )
}

function MostWanted() {
  const { colors } = useTheme();

  return (
    <Star>
      <Feather name="star" size={16} color={colors.text70}/>
    </Star>
  )
}

const WishContainer = styled.TouchableOpacity`
  width: 48%;
  flex-direction: column;
  margin-bottom: 16px;
  background: ${p => p.theme.colors.background};
  border-radius: 16px;
`

const ImageContaier = styled.View`
  height: 150px;
`;

const WishImage = styled(ImageBox)`
  height: 150px;
  border-radius: 16px 16px 0px 0px;
`

const TextGroup = styled.View`
  padding: 6px;
`;

const Badge = styled.View`
  position: absolute;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  left: 8px;
  bottom: 8px;
  background-color: ${p => p.theme.colors.duotoneBackground};
  padding: 4px 8px;
  border-radius: 12px;
`;

const Star = styled.View`
  position: absolute;
  right: 4px;
  top: 4px;
  background: ${p => p.theme.colors.duotoneBackground};
  padding: 4px;
  border-radius: 4px;
  flex-direction: row;
  gap: 4px;
  align-items: center;
`;