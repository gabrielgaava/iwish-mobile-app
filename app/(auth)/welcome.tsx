import { ActionButton } from "@/components/buttons";
import { Container } from "@/components/ui/container";
import { Screen } from "@/components/ui/screen";
import { useTheme } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StyleSheet, Text } from "react-native";
import styled from "styled-components/native";

export default function WelcomeScreen() {
  const router = useRouter();
  const {colors} = useTheme();

  return (
    <Screen>
      <LinearGradient
        colors={colors.primaryGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={{color: colors.white70}}>Welcome to</Text>
        <Text style={{color: colors.white70}}>iWish</Text>
      </LinearGradient>
      <Body type="column">
        <Text style={{ color: colors.text }}>Welcome 1</Text>
        <Text>Welcome 1</Text>
        <Text>Welcome 1</Text>
        <ActionButton text="Fazer Login" onPress={() => router.push("/(auth)/login")}/>
        <ActionButton text="Criar Conta" onPress={() => router.push("/(auth)/register")}/>
      </Body>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#1a73e8",
  },
  header: {
    height: "25%",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});

const Body = styled(Container)`
  flex: 1;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  margin-top: -30px;
  padding-top: 42px;
  padding-bottom: 24px;
  padding-left: 32px;
  padding-right: 32px;
  justify-content: flex-start;
  align-items: center;
  background-color: ${props => props.theme.colors.background};
  /* sombra no RN via styled-components */
  shadow-color: #000;
  shadow-offset: 0px -2px;
  shadow-opacity: 0.1;
  shadow-radius: 6px;
  elevation: 6;
`;
