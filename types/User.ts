export type User = {
  id: string;
  email: string;
  name: string;
  image: string | null;
  updatedAt: Date;
};

export type UserSession = {
  token: string;
  id: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
};
