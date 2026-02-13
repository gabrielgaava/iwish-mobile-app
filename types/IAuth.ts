export type AuthUser = {
  id: string;
  email: string;
  name: string;
  image?: string;
}

export type Session = {
  accessToken: string;
  refreshToken: string;
  expiration: number;
}

export type SessionStorage = Session & {
  userId: string;
  isLoggedIn: boolean;
};

export interface SocialLoginRequest {
  provider: "google" | "apple",
  idToken: string;
}

export type VerifyTypes = "email-verification" | "sign-in" | "forget-password";
export type ExtendedVerifyTypes = VerifyTypes | "password-recovery";