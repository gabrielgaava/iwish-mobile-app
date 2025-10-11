import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";
import { AuthContext } from "@/lib/AuthContext";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function HomeScreen() {
  const authState = useContext(AuthContext);
  const router = useRouter();

  const goToProfile = () => {
    router.push("/profile");
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}
        >
          HOME!
        </ThemedText>
      </ThemedView>
      <ThemedText>Logged In {authState.isLoggedIn && "LOGADO"}.</ThemedText>

      <TouchableOpacity onPress={() => authState.logOut()} style={styles.button}>
        <ThemedText>Sign Out</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => goToProfile()} style={styles.button}>
        <ThemedText>Perfil</ThemedText>
      </TouchableOpacity>


    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 5,
  }
});
