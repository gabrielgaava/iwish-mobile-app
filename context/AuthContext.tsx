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
  socialSignIn: (data: SocialLoginRequest) => any;
  signOut: () => void;
  getUser: () => Promise<AuthUser>;
};

const AUTH_STORAGE_KEY = "iWishApp-AuthState";
export const AuthContext = createContext<AuthState>({} as AuthState);

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Set all data when a user is authenticated
  async function setAuthUser(user: AuthUser, tokenData: AuthResponse) {
    const storage: SessionStorage = {
      userId: user.id,
      isLoggedIn: true,
      ...tokenData
    }

    console.log("Logged, Stored: ", storage);

    await storageValue(AUTH_STORAGE_KEY, storage);

    setUser(user);
    setToken(tokenData.accessToken);
    setIsLoggedIn(true);
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

  async function signOut() {
    setIsLoggedIn(false);
    setToken(null);
    setUser(null);
    await storageValue(AUTH_STORAGE_KEY, null);
    router.replace("/(auth)/login");
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

    router.replace("/(protected)/(tabs)");
  }

  async function getUser(): Promise<AuthUser> {
    const response = await api.get<AuthUser>("/user/me")

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
    try {
      const data = await getValueFor(AUTH_STORAGE_KEY);
      //console.log("Checking Local State", data);

      if (data === null || data === undefined) {
        return nullState();
      }

      const state: SessionStorage = JSON.parse(data);

      if(state?.accessToken) {
        setApiAuthorization(state.accessToken);
        const response = await api.get("/user/me");

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

        const session: AuthResponse = {
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          expiration: state.expiration,
        };

        return setAuthUser(response.data, session);
      }
    }

    catch (error) {
      console.log(error);
      setIsLoggedIn(false);
      alert("Error loading auth state");
    }

    finally {
      setIsReady(true);
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
      signOut,
      socialSignIn,
      getUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}
