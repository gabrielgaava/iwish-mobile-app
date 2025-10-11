import { ThemedText } from "@/components/themed-text";
import { AuthContext } from "@/lib/AuthContext";
import { useContext } from "react";
import { View } from "react-native";

export default function ProfileScreen() {
  const authState = useContext(AuthContext);
  
  return (
    <View>
        <ThemedText>Profile Screen</ThemedText>
        <ThemedText>Logged In {authState.isLoggedIn && "LOGADO"}.</ThemedText>
    </View>
  );
}