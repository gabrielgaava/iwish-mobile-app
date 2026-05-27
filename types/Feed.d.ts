export type FeedResponse = {
    data: FeedItem[];
    nextCursor: string;
};

export type FeedUser = {
    id: string;
    name: string;
    image?: string;
    username: string;
}

export type FeedWishlist = {
    id: string;
    name: string;
    cover_image?: string;
    wishes: { id: string }[];
}

export type FeedWish = {
    id: string;
    title?: string;
    price?: number;
    link?: string;
    images?: { url: string }[];
}

export type FeedItem = {
    id: string;
    type: "wishlist_created" | "wish_added";
    createdAt: Date;
    user: FeedUser;
    wishlist?: FeedWishlist;
    wish?: FeedWish;
}
