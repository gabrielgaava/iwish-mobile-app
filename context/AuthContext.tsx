import { api, setApiAuthorization } from "@/lib/api";
import { getValueFor, storageValue } from "@/lib/storage";
import { AuthResponse } from "@/types/ApiResponse";
import { AuthUser, Session, SessionStorage, SocialLoginRequest } from "@/types/IAuth";
import { useRouter } from "expo-router";
import { createContext, PropsWithChildren, useEffect, useState } from "react";

type AuthState = {
  isLoggedIn: boolean;
  isReady: boolean;
  user: AuthUser | null;
  signIn: (email: string, password: string) => any;
  signInWithTokens: (tokenData: AuthResponse) => Promise<void>;
  socialSignIn: (data: SocialLoginRequest) => any;
  signOut: () => void;
  getUser: () => Promise<AuthUser>;
  updateUser: (data: Partial<AuthUser>) => void;
};

const AUTH_STORAGE_KEY = "iWishApp-AuthState";
export const AuthContext = createContext<AuthState>({} as AuthState);

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  function applyAuthState(user: AuthUser, tokenData: AuthResponse) {
    setApiAuthorization(tokenData.accessToken);
    setUser(user);
    setToken(tokenData.accessToken);
    setIsLoggedIn(true);
    setIsReady(true);
  }

  // Set all data when a user is authenticated
  async function setAuthUser(user: AuthUser, tokenData: AuthResponse) {
    const storage: SessionStorage = {
      userId: user.id,
      isLoggedIn: true,
      ...tokenData
    }

    console.log("Logged, Stored: ", storage);

    await storageValue(AUTH_STORAGE_KEY, storage);

    applyAuthState(user, tokenData);
  }

  async function signIn(email: string, password: string) {

    const response = await api.post("/auth/login", { email, password })
     
      if(response.status !== 200) {
        return { error: response.data, data: null };
      }

      console.log(response.data);
      const accessToken = response.data.accessToken;

      // Set the Authorizaiton Header in Axios Default
      setApiAuthorization(accessToken);

      // Fetch logged user data
      const user = await getUser();
      await setAuthUser(user, response.data);

      return { error: null, data: response.data };
  };

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
    setToken(null);
    setUser(null);
    await storageValue(AUTH_STORAGE_KEY, null);
    router.replace("/(auth)/welcome");
  };

  async function socialSignIn(data: SocialLoginRequest) {
    const response = await api.post("/auth/social", {
      provider: data.provider,
      idToken: data.idToken,
    })

    // Error in social Login
    if (response.status !== 200) {
      return response.data;
    }

    setApiAuthorization(response.data.accessToken);
    const user = await getUser();
    await setAuthUser(user, response.data);

    router.replace("/(protected)/(tabs)/(home)");
  }

  function updateUser(data: Partial<AuthUser>) {
    setUser((prev) => (prev ? { ...prev, ...data } : prev));
  }

  async function getUser(): Promise<AuthUser> {
    const response = await api.get("/users/me")

    if(response.status !== 200) {
      console.log("Error Retrive User", response.data);
    } 

    return response.data;
  }

  async function refreshToken(refreshToken: string): Promise<Session> {
    const response = await api.post("/auth/refresh", { refreshToken });

    if (response.status !== 200) {
      throw Error("Error to refresh token. Login again!");
    }

    return response.data as Session;
  }

  function nullState() {
    setIsReady(true);
    setIsLoggedIn(false);
    setUser(null);
    setToken(null);
  }

  async function loadAuthState() {
    setIsReady(false);

    try {
      const data = await getValueFor(AUTH_STORAGE_KEY);
      //console.log("Checking Local State", data);

      if (data === null || data === undefined) {
        return nullState();
      }

      const state: SessionStorage = JSON.parse(data);

      if(state?.accessToken) {
        setApiAuthorization(state.accessToken);
        const response = await api.get("/users/me");

        if(response.status >= 300) {
          if (response.data.code === "TOKEN_EXPIRED") {
              console.log("Session Expired - Using Refresh Token");            
              const newSession = await refreshToken(state.refreshToken);
              setApiAuthorization(newSession.accessToken);
              const user = await getUser();
              return setAuthUser(user, newSession);
          }

          return nullState();      
        }

        const latestData = await getValueFor(AUTH_STORAGE_KEY);
        const latestState: SessionStorage = latestData ? JSON.parse(latestData) : state;

        const session: AuthResponse = {
          accessToken: latestState.accessToken,
          refreshToken: latestState.refreshToken,
          expiration: latestState.expiration,
        };

        return applyAuthState(response.data, session);
      }

      return nullState();
    }

    catch (error) {
      console.log(error);
      nullState();
      alert("Error loading auth state");
    }
  }


  //TODO: Check if token is expired. If is, use the refresh token for a new one
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
