import { Txt } from "@/components/ui/text";
import { normalizeImageUri } from "@/utils/format";
import { router } from "expo-router";
import { Container, CoverImg, ImageContainer, TouchContainer } from "./styles";
import { WishlistCardProps } from "./wishlist-card";

export default function WishlistCard({ wishlist, width }: WishlistCardProps) {

  function goToWishlistPage() {
    return router.push(`/wishlist/${wishlist.id}`);
  }

  return (
    <TouchContainer onPress={() => goToWishlistPage()} activeOpacity={0.7} width={width}>
      <Container>
        <ImageContainer>
          <CoverImg source={normalizeImageUri(wishlist.cover_image)} />
        </ImageContainer>
        <Txt text={wishlist.name} weight="semi"/>
        <Txt text={`${wishlist.wishes.length} itens`} />
      </Container>
    </TouchContainer>
  )
}