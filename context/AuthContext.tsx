import { api, setApiAuthorization } from "@/lib/api";
import { deleteValue, getValueFor, storageValue } from "@/lib/storage";
import { AuthResponse } from "@/types/ApiResponse";
import { AuthUser, SessionStorage, SocialLoginRequest } from "@/types/IAuth";
import { useRouter } from "expo-router";
import { createContext, PropsWithChildren, useEffect, useState } from "react";

type AuthState = {
  isLoggedIn: boolean;
  isReady: boolean;
  user: AuthUser | null;
  signIn: (email: string, password: string) => Promise<{ error: any; data: any }>;
  signInWithTokens: (tokenData: AuthResponse) => Promise<void>;
  socialSignIn: (data: SocialLoginRequest) => Promise<{ error: any; data: any }>;
  signOut: () => void;
  getUser: () => Promise<AuthUser>;
  updateUser: (data: Partial<AuthUser>) => void;
};

const AUTH_STORAGE_KEY = "iWishApp-AuthState";
export const AuthContext = createContext<AuthState>({} as AuthState);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  function applyAuthState(user: AuthUser, tokenData: AuthResponse) {
    setApiAuthorization(tokenData.accessToken);
    setUser(user);
    setIsLoggedIn(true);
    setIsReady(true);
  }

  async function setAuthUser(user: AuthUser, tokenData: AuthResponse) {
    const storage: SessionStorage = {
      userId: user.id,
      isLoggedIn: true,
      ...tokenData,
    };

    await storageValue(AUTH_STORAGE_KEY, storage);
    applyAuthState(user, tokenData);
  }

  async function signIn(email: string, password: string) {
    const response = await api.post("/auth/login", { email, password });

    if (response.status !== 200) {
      return { error: response.data, data: null };
    }

    setApiAuthorization(response.data.accessToken);
    const user = await getUser();
    await setAuthUser(user, response.data);

    return { error: null, data: response.data };
  }

  /**
   * Autentica o usuário a partir de tokens já obtidos (ex: após validação de OTP).
   * Busca os dados do usuário, persiste a sessão e navega para a área logada.
   */
  async function signInWithTokens(tokenData: AuthResponse) {
    setApiAuthorization(tokenData.accessToken);
    const user = await getUser();
    await setAuthUser(user, tokenData);
    router.replace("/(protected)/(tabs)/(home)");
  }

  async function signOut() {
    setIsLoggedIn(false);
    setUser(null);
    await deleteValue(AUTH_STORAGE_KEY);
    router.replace("/(auth)/welcome");
  }

  async function socialSignIn(data: SocialLoginRequest) {
    const response = await api.post("/auth/social", {
      provider: data.provider,
      idToken: data.idToken,
      name: data.name,
    });

    if (response.status !== 200) {
      return { error: response.data, data: null };
    }

    setApiAuthorization(response.data.accessToken);
    const user = await getUser();
    await setAuthUser(user, response.data);

    return { error: null, data: response.data };
  }

  function updateUser(data: Partial<AuthUser>) {
    setUser((prev) => (prev ? { ...prev, ...data } : prev));
  }

  async function getUser(): Promise<AuthUser> {
    const response = await api.get("/users/me");

    if (response.status !== 200) {
      console.error("Error retrieving user", response.data);
    }

    return response.data;
  }

  function nullState() {
    setIsReady(true);
    setIsLoggedIn(false);
    setUser(null);
  }

  async function loadAuthState() {
    setIsReady(false);

    try {
      const data = await getValueFor(AUTH_STORAGE_KEY);

      if (!data) {
        return nullState();
      }

      const state: SessionStorage = JSON.parse(data);

      if (!state?.accessToken) {
        return nullState();
      }

      // Set auth header and attempt to load the user.
      // The Axios interceptor handles TOKEN_EXPIRED transparently:
      // it refreshes the session and retries the request automatically.
      setApiAuthorization(state.accessToken);
      const response = await api.get("/users/me");

      if (response.status >= 300) {
        return nullState();
      }

      const session: AuthResponse = {
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        expiration: state.expiration,
      };

      return applyAuthState(response.data, session);
    } catch (error) {
      console.error("Error loading auth state:", error);
      nullState();
    }
  }

  useEffect(() => {
    loadAuthState();
  }, []);

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      isReady,
      user,
      signIn,
      signInWithTokens,
      signOut,
      socialSignIn,
      getUser,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
