import { Wishlist } from "@/types/User";

export type WishlistCardProps = {
  onClick: (wishlistId: string) => void,
  wishlist: Wishlist
  width: string;
}