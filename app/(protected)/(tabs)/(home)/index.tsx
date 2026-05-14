import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function HomeScreen() {
  const { signOut, user } = useAuth();
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
      <ThemedText>Olá {user?.name}.</ThemedText>
      <ThemedText>{user?.email}.</ThemedText>

      <TouchableOpacity onPress={() => signOut()} style={styles.button}>
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
