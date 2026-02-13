export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  wishlists: Wishlist[];
};

export type UserSession = {
  token: string;
  id: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
};

export type Wishlist = {
  id: string;
  name: string;
  description: string;
  cover_image: string;
  is_public: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
  wishes: Wish[];
};

export type WishImages = {
  id: string;
  url:string;
  wish_id: string;
}

export type Wish = {
  id: string;
  title?: string;
  price?: number;
  images?: WishImages[];
  created_at?: string;
  updated_at?: string;
};