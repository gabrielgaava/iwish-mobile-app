import { createAuthClient } from "better-auth/react";
import { SplashScreen, useRouter } from "expo-router";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
//import { User } from "@/types/User";

SplashScreen.preventAutoHideAsync();

const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
  basePath: "/auth",
});

type AuthState = {
  isLoggedIn: boolean;
  isReady: boolean;
  logIn: (email: string, password: string) => void;
  logOut: () => void;
};

export const AuthContext = createContext<AuthState>({
  isLoggedIn: false,
  isReady: false,
  logIn: async () => {},
  logOut: async () => {},
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<any>(null);  
  const [isReady, setIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const authState = {} as any;

  const logIn = async (email: string, password: string) => {
    const { data } = await authClient.signIn.email({
        email,
        password,
    });
    
    if(data) {
      setUser(data.user);
      setIsLoggedIn(true);
      router.replace("/");
    }
  };

  const logOut = async () => {
    const { error } = await authClient.signOut();
    
    if (!error) {
      setUser(null);
      setIsLoggedIn(false);
      router.replace("/login");
    }
  };

  useEffect(() => {  
    if(!authState.isPending) {
      setIsReady(true);
      setIsLoggedIn(!!authState.data);
      setUser(authState.data?.user ?? null);
    } 
  }, [authState]);

  useEffect(() => {
    console.log("Ready ?", isReady)
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  console.log("Login State", isLoggedIn, user);

  return (
    <AuthContext.Provider
      value={{
        isReady,
        isLoggedIn,
        logIn,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}